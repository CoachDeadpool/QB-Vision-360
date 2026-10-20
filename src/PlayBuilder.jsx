import React, { useState, useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Upload, Plus, Trash2, Download, Save, Undo2, Move, PenLine, UserPlus, Image as ImageIcon, FileText, Copy } from "lucide-react";

// ---------------------------------------------------------------------------
// Play Builder: a QB uploads a photo of a hand-drawn play, traces it on a
// clean field (players + routes), adds assignments and notes, then downloads
// the play (or the whole playbook) as a Word document.
// Everything runs in the browser: no backend, no AI call, no cost.
// ---------------------------------------------------------------------------

const W = 640;
const H = 420;
const LOS = 320; // line of scrimmage (y)
const YD = 12; // pixels per yard, vertically
const STORAGE_KEY = "qbv360-playbook";

const LABELS = ["X", "Y", "Z", "H", "W", "F", "RB", "QB"];
const LABEL_COLORS = {
  X: "#d68910", Y: "#2e86c1", Z: "#c0392b", H: "#27ae60", W: "#8e44ad",
  F: "#16a085", RB: "#6b6b6b", QB: "#1e3a63", TE: "#16a085",
};
const EXTRA_COLORS = ["#b9770e", "#1f618d", "#922b21", "#1e8449", "#6c3483"];

const ROUTE_OPTIONS = [
  "Go / Vertical", "Fade", "Seam", "Post", "Corner", "Dig / In", "Out", "Slant",
  "Hitch", "Curl", "Comeback", "Shallow cross", "Deep cross / Over", "Drag",
  "Flat", "Wheel", "Settle in the window", "Motion", "Pass protect", "Block",
];

const FORMATIONS = {
  blank: { name: "Blank (just QB)", players: [] },
  spread22: {
    name: "2x2 Spread",
    players: [
      ["X", 50, LOS], ["H", 170, LOS + 12], ["Y", 470, LOS + 12], ["Z", 590, LOS], ["RB", 280, LOS + 58],
    ],
  },
  trips: {
    name: "Trips Right (3x1)",
    players: [
      ["X", 50, LOS], ["H", 440, LOS + 12], ["Y", 510, LOS + 12], ["Z", 595, LOS], ["RB", 280, LOS + 58],
    ],
  },
  empty: {
    name: "Empty (5 wide)",
    players: [
      ["X", 45, LOS], ["H", 150, LOS + 12], ["W", 215, LOS + 12], ["Y", 470, LOS + 12], ["Z", 595, LOS],
    ],
  },
};

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const colorFor = (label, i = 0) => LABEL_COLORS[label] || EXTRA_COLORS[i % EXTRA_COLORS.length];

function makePlayer(label, x, y, i = 0) {
  return {
    id: uid(), label, x, y, color: colorFor(label, i),
    assignment: "", depth: "",
    route: { points: [], end: "arrow", curved: true, dashed: false },
  };
}

function newPlay(formationKey = "spread22") {
  const f = FORMATIONS[formationKey] || FORMATIONS.blank;
  const players = f.players.map(([l, x, y], i) => makePlayer(l, x, y, i));
  players.push(makePlayer("QB", W / 2, LOS + 58));
  return {
    id: uid(), name: "", formation: formationKey === "blank" ? "" : f.name,
    concept: "", qbRead: "", notes: "",
    photo: null, photoW: 0, photoH: 0,
    players, updated: Date.now(),
  };
}

// ---- geometry ---------------------------------------------------------------

function routePathD(pts, curved) {
  if (pts.length < 2) return "";
  if (!curved || pts.length < 3) return "M " + pts.map((p) => `${p.x} ${p.y}`).join(" L ");
  // Catmull-Rom -> cubic Bezier
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function RouteEnd({ pts, end, color }) {
  if (pts.length < 2 || end === "none") return null;
  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  if (end === "dot") return <circle cx={b.x} cy={b.y} r={6} fill={color} />;
  if (end === "block") {
    const px = Math.cos(ang + Math.PI / 2) * 11, py = Math.sin(ang + Math.PI / 2) * 11;
    return <line x1={b.x - px} y1={b.y - py} x2={b.x + px} y2={b.y + py} stroke={color} strokeWidth={4} strokeLinecap="round" />;
  }
  const len = 15, spread = 0.45;
  const l = { x: b.x - len * Math.cos(ang - spread), y: b.y - len * Math.sin(ang - spread) };
  const r = { x: b.x - len * Math.cos(ang + spread), y: b.y - len * Math.sin(ang + spread) };
  return <polygon points={`${b.x},${b.y} ${l.x},${l.y} ${r.x},${r.y}`} fill={color} />;
}

// Where a route "breaks" flat (a dig, out, cross, settle). Used for the depth marker.
function breakPoint(pl) {
  const pts = [{ x: pl.x, y: pl.y }, ...pl.route.points];
  for (let i = 1; i < pts.length - 1; i++) {
    const dx = Math.abs(pts[i + 1].x - pts[i].x), dy = Math.abs(pts[i + 1].y - pts[i].y);
    if (dx > 8 && dy <= 0.4 * dx) return pts[i];
  }
  return null;
}

// Keeps the depth number in sync with the drawn route until the player types their own.
function withAutoDepth(pl) {
  if (pl.depthAuto === false) return pl;
  const bp = breakPoint(pl);
  const yards = bp ? Math.round((LOS - bp.y) / YD) : 0;
  return { ...pl, depth: yards > 0 ? String(yards) : "" };
}

// ---- the field (used for both the live editor and the Word export) ---------

function FieldSvg({ play, selectedId = null, photoOpacity = 0.45, showPhoto = true, exporting = false, svgRef, handlers = {} }) {
  const font = "Arial, Helvetica, sans-serif";
  const ol = [-68, -34, 0, 34, 68];
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width={exporting ? W * 2 : "100%"}
      height={exporting ? H * 2 : undefined}
      xmlns="http://www.w3.org/2000/svg"
      style={exporting ? undefined : { display: "block", touchAction: "none", userSelect: "none", cursor: handlers.cursor || "default" }}
      onPointerDown={handlers.onBackgroundDown}
      onPointerMove={handlers.onMove}
      onPointerUp={handlers.onUp}
      onPointerCancel={handlers.onUp}
    >
      <rect x={0} y={0} width={W} height={H} fill="#ffffff" />
      {!exporting && showPhoto && play.photo && (
        <image href={play.photo} x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid meet" opacity={photoOpacity} style={{ pointerEvents: "none" }} />
      )}
      {[5, 10, 15, 20, 25].map((yd) => (
        <g key={yd}>
          <line x1={0} y1={LOS - yd * YD} x2={W} y2={LOS - yd * YD} stroke="#e4e4e4" strokeWidth={1} />
          <text x={6} y={LOS - yd * YD - 3} fontSize={10} fill="#aaaaaa" fontFamily={font}>{yd}</text>
        </g>
      ))}
      <line x1={0} y1={LOS} x2={W} y2={LOS} stroke="#555555" strokeWidth={2} />
      <text x={W - 6} y={LOS - 5} fontSize={10} fill="#777777" textAnchor="end" fontFamily={font}>LOS</text>

      {ol.map((dx) => dx === 0 ? (
        <rect key={dx} x={W / 2 - 10} y={LOS - 10} width={20} height={20} fill="#555555" />
      ) : (
        <circle key={dx} cx={W / 2 + dx} cy={LOS} r={10} fill="#ffffff" stroke="#555555" strokeWidth={2} />
      ))}

      {/* routes under players */}
      {play.players.map((p) => {
        const pts = [{ x: p.x, y: p.y }, ...p.route.points];
        if (pts.length < 2) return null;
        return (
          <g key={`r-${p.id}`} style={{ pointerEvents: "none" }}>
            <path d={routePathD(pts, p.route.curved)} fill="none" stroke={p.color} strokeWidth={3.5}
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray={p.route.dashed ? "9 7" : undefined} />
            <RouteEnd pts={pts} end={p.route.end} color={p.color} />
            {!exporting && selectedId === p.id && p.route.points.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r={4} fill="#ffffff" stroke={p.color} strokeWidth={2} />
            ))}
          </g>
        );
      })}

      {/* depth markers */}
      {play.players.map((p) => {
        if (!p.depth || !p.route.points.length) return null;
        const bp = breakPoint(p) || p.route.points[0];
        return (
          <g key={`d-${p.id}`} style={{ pointerEvents: "none" }}>
            <circle cx={bp.x + 16} cy={bp.y - 16} r={12} fill="#ffffff" stroke="#333333" strokeWidth={1.5} />
            <text x={bp.x + 16} y={bp.y - 12} fontSize={12} fontWeight="bold" textAnchor="middle" fontFamily={font} fill="#222222">{p.depth}</text>
          </g>
        );
      })}

      {/* players */}
      {play.players.map((p) => {
        const sel = !exporting && selectedId === p.id;
        const r = p.label.length > 1 ? 17 : 15;
        return (
          <g key={p.id} onPointerDown={handlers.onPlayerDown ? (e) => handlers.onPlayerDown(e, p) : undefined} style={exporting ? undefined : { cursor: "pointer" }}>
            {sel && <circle cx={p.x} cy={p.y} r={r + 6} fill="none" stroke="#c8a24a" strokeWidth={3} />}
            <circle cx={p.x} cy={p.y} r={r} fill="#ffffff" stroke={p.color} strokeWidth={3} />
            <text x={p.x} y={p.y + 5} fontSize={p.label.length > 2 ? 10 : 14} fontWeight="bold" textAnchor="middle" fontFamily={font} fill="#111111">{p.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---- export helpers ---------------------------------------------------------

async function playToPng(play) {
  const markup = renderToStaticMarkup(<FieldSvg play={play} exporting />);
  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = W * 2;
    canvas.height = H * 2;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const out = await new Promise((r) => canvas.toBlob(r, "image/png"));
    return new Uint8Array(await out.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

function dataUrlToBytes(dataUrl) {
  const b64 = dataUrl.split(",")[1] || "";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function shrinkImage(file, maxSide = 1400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: c.toDataURL("image/jpeg", 0.8), w, h });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function safeFileName(s) {
  return (s || "play").replace(/[^a-z0-9 _-]/gi, "").trim().replace(/\s+/g, "_") || "play";
}

async function buildDocx(plays, { title, author }) {
  const d = await import("docx");
  const { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, PageBreak, Footer } = d;

  const NAVY = "1E3A63", GOLD = "C8A24A";
  const border = { style: BorderStyle.SINGLE, size: 4, color: "D8CBA9" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const COLS = [1300, 6260, 1800]; // sums to 9360 (6.5in content width)

  const cell = (text, w, opts = {}) => new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: opts.header ? { fill: NAVY, type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: text || "", bold: !!opts.header || !!opts.bold, color: opts.header ? "FFFFFF" : undefined })] })],
  });

  const section = (label) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(label)] });
  const body = (text) => text.split(/\n+/).filter(Boolean).map((t) => new Paragraph({ spacing: { after: 100 }, children: [new TextRun(t)] }));

  const children = [];

  if (plays.length > 1) {
    children.push(
      new Paragraph({ spacing: { before: 2400, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: title, bold: true, size: 56, color: NAVY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: `${plays.length} plays`, size: 26, color: "5A5140" })] }),
      ...plays.map((p, i) => new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${i + 1}. ${p.name || "Untitled play"}`, size: 24 })] })),
      new Paragraph({ children: [new PageBreak()] }),
    );
  }

  for (let i = 0; i < plays.length; i++) {
    const p = plays[i];
    const png = await playToPng(p);
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(p.name || "Untitled play")] }));
    if (p.formation) children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Formation: ", bold: true }), new TextRun(p.formation)] }));
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new ImageRun({ type: "png", data: png, transformation: { width: 600, height: Math.round((600 * H) / W) } })] }));

    const rows = p.players
      .filter((pl) => pl.assignment || pl.route.points.length)
      .map((pl) => new TableRow({ children: [cell(pl.label, COLS[0], { bold: true }), cell(pl.assignment || (pl.route.points.length ? "Route as drawn" : ""), COLS[1]), cell(pl.depth ? `${pl.depth} yds` : "", COLS[2])] }));
    if (rows.length) {
      children.push(section("Assignments"));
      children.push(new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: COLS,
        rows: [new TableRow({ tableHeader: true, children: [cell("Player", COLS[0], { header: true }), cell("Assignment", COLS[1], { header: true }), cell("Depth", COLS[2], { header: true })] }), ...rows],
      }));
    }
    if (p.concept) { children.push(section("Concept")); children.push(...body(p.concept)); }
    if (p.qbRead) { children.push(section("QB Read")); children.push(...body(p.qbRead)); }
    if (p.notes) { children.push(section("Coaching Notes")); children.push(...body(p.notes)); }
    if (p.photo && p.photoW) {
      const w = Math.min(420, p.photoW);
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun("Original Sketch")] }));
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: "jpg", data: dataUrlToBytes(p.photo), transformation: { width: w, height: Math.round((w * p.photoH) / p.photoW) } })] }));
    }
    if (i < plays.length - 1) children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  const doc = new Document({
    creator: author || "QB Vision",
    title,
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 120 }, outlineLevel: 0, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 4 } } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, color: NAVY }, paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 1 } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Made with QB Vision${author ? ` · ${author}` : ""}`, size: 16, color: "8A8070" })] })] }) },
      children,
    }],
  });
  return Packer.toBlob(doc);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ---- UI ---------------------------------------------------------------------

export default function PlayBuilder({ tokens: T, playerName = "" }) {
  const [plays, setPlays] = useState([]);
  const [play, setPlay] = useState(() => newPlay("spread22"));
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("move"); // move | add | route
  const [addLabel, setAddLabel] = useState("X");
  const [customLabel, setCustomLabel] = useState("");
  const [snap, setSnap] = useState(true);
  const [photoOpacity, setPhotoOpacity] = useState(0.45);
  const [showPhoto, setShowPhoto] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY, false);
        if (r) setPlays(JSON.parse(r.value));
      } catch (e) {}
    })();
  }, []);

  const selected = play.players.find((p) => p.id === selectedId) || null;

  function flash(m) {
    setMessage(m);
    setTimeout(() => setMessage((cur) => (cur === m ? "" : cur)), 3500);
  }

  function update(fn) {
    setPlay((cur) => ({ ...fn(cur), updated: Date.now() }));
    setDirty(true);
  }
  function updatePlayer(id, fn) {
    update((cur) => ({ ...cur, players: cur.players.map((p) => (p.id === id ? fn(p) : p)) }));
  }

  function toField(e) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.max(4, Math.min(W - 4, p.x)), y: Math.max(4, Math.min(H - 4, p.y)) };
  }
  const snapY = (y) => (snap ? LOS - Math.round((LOS - y) / YD) * YD : y);

  const handlers = {
    cursor: mode === "move" ? "default" : "crosshair",
    onPlayerDown(e, p) {
      e.stopPropagation();
      if (mode === "route" && selectedId && selectedId !== p.id) {
        // tapping another player while drawing switches to that player
        setSelectedId(p.id);
        return;
      }
      setSelectedId(p.id);
      if (mode === "move" || mode === "add") {
        const start = toField(e);
        dragRef.current = { id: p.id, last: start };
        try { svgRef.current.setPointerCapture(e.pointerId); } catch (err) {}
      }
    },
    onBackgroundDown(e) {
      const pt = toField(e);
      if (mode === "add") {
        const label = (customLabel.trim() || addLabel).toUpperCase().slice(0, 3);
        const pl = makePlayer(label, pt.x, Math.abs(pt.y - LOS) < 10 ? LOS : pt.y, play.players.length);
        update((cur) => ({ ...cur, players: [...cur.players, pl] }));
        setSelectedId(pl.id);
        setCustomLabel("");
        const used = new Set([...play.players.map((p) => p.label), label]);
        const next = LABELS.find((l) => !used.has(l));
        if (next) setAddLabel(next);
      } else if (mode === "route" && selectedId) {
        const p = { x: pt.x, y: snapY(pt.y) };
        updatePlayer(selectedId, (pl) => withAutoDepth({ ...pl, route: { ...pl.route, points: [...pl.route.points, p] } }));
      } else if (mode === "move") {
        setSelectedId(null);
      }
    },
    onMove(e) {
      const d = dragRef.current;
      if (!d) return;
      const pt = toField(e);
      const dx = pt.x - d.last.x, dy = pt.y - d.last.y;
      d.last = pt;
      updatePlayer(d.id, (pl) => ({
        ...pl, x: pl.x + dx, y: pl.y + dy,
        route: { ...pl.route, points: pl.route.points.map((q) => ({ x: q.x + dx, y: q.y + dy })) },
      }));
    },
    onUp() { dragRef.current = null; },
  };

  async function onPhotoPicked(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const { dataUrl, w, h } = await shrinkImage(file);
      update((cur) => ({ ...cur, photo: dataUrl, photoW: w, photoH: h }));
      setShowPhoto(true);
      flash("Sketch loaded. Trace over it with players and routes.");
    } catch (err) {
      flash("Couldn't read that image. Try a JPG or PNG photo.");
    }
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function savePlay() {
    const toSave = { ...play, name: play.name.trim() || `Play ${plays.length + 1}` };
    setPlay(toSave);
    const exists = plays.some((p) => p.id === toSave.id);
    const next = exists ? plays.map((p) => (p.id === toSave.id ? toSave : p)) : [toSave, ...plays];
    setPlays(next);
    let ok = null;
    try { ok = await window.storage.set(STORAGE_KEY, JSON.stringify(next), false); } catch (e) {}
    if (!ok) {
      // most likely out of browser storage because of sketch photos; retry without photos
      const lite = next.map((p) => ({ ...p, photo: null, photoW: 0, photoH: 0 }));
      try { ok = await window.storage.set(STORAGE_KEY, JSON.stringify(lite), false); } catch (e) {}
      flash(ok ? "Saved. Your device ran out of space for sketch photos, so the photos weren't kept." : "Couldn't save on this device.");
    } else {
      flash(`Saved "${toSave.name}" to your playbook.`);
    }
    setDirty(false);
  }

  function startNew(formationKey) {
    if (dirty && !window.confirm("Start a new play? Unsaved changes to this one will be lost.")) return;
    setPlay(newPlay(formationKey));
    setSelectedId(null);
    setMode("move");
    setDirty(false);
  }

  function openPlay(p) {
    if (dirty && p.id !== play.id && !window.confirm("Open this play? Unsaved changes to the current play will be lost.")) return;
    setPlay(p);
    setSelectedId(null);
    setMode("move");
    setDirty(false);
  }

  async function deletePlay(p) {
    if (!window.confirm(`Delete "${p.name}" from your playbook?`)) return;
    const next = plays.filter((x) => x.id !== p.id);
    setPlays(next);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(next), false); } catch (e) {}
  }

  function duplicatePlay() {
    const copy = JSON.parse(JSON.stringify(play));
    copy.id = uid();
    copy.name = play.name ? `${play.name} (copy)` : "";
    copy.players = copy.players.map((p) => ({ ...p, id: uid() }));
    setPlay(copy);
    setSelectedId(null);
    setDirty(true);
    flash("Copied. Change it up, give it a new name and save.");
  }

  async function exportDocs(list, filename, title) {
    setBusy("Building your Word doc...");
    try {
      const blob = await buildDocx(list, { title, author: playerName });
      downloadBlob(blob, filename);
      flash("Word doc downloaded.");
    } catch (e) {
      console.error(e);
      flash("Something went wrong building the Word doc.");
    }
    setBusy("");
  }

  // ---- styles
  const card = { background: "#fff", border: `1px solid ${T.creamLine}`, borderRadius: 6, padding: 16, marginBottom: 16 };
  const label = { fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600, color: T.inkSoft, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 };
  const input = { width: "100%", padding: "8px 10px", border: `1px solid ${T.creamLine}`, borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, boxSizing: "border-box", background: "#fff" };
  const btn = (primary, active) => ({
    display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
    fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: 0.4,
    padding: "8px 12px", borderRadius: 4,
    background: primary || active ? T.navyMid : "transparent",
    color: primary || active ? T.gold : T.navyMid,
    border: `1px solid ${T.navyMid}`,
  });
  const chip = (active, color) => ({
    minWidth: 34, padding: "5px 8px", borderRadius: 16, cursor: "pointer",
    fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
    border: `2px solid ${color || T.navyMid}`,
    background: active ? (color || T.navyMid) : "#fff",
    color: active ? "#fff" : T.ink,
  });
  const stepTitle = (n, t) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ width: 22, height: 22, borderRadius: 11, background: T.gold, color: T.navyDeep, fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 12.5, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{t}</span>
    </div>
  );

  const modeHelp = {
    move: "Drag players to line them up. Tap a player to select them.",
    add: "Pick a letter, then tap the field to place that player.",
    route: selected ? `Tap the field to draw ${selected.label}'s route, one point at a time. Tap another player to switch.` : "Tap a player first, then tap the field to draw their route.",
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Play Builder</h1>
      <p style={{ color: T.inkSoft, marginBottom: 20, fontSize: 14.5, lineHeight: 1.55 }}>
        Drew a play on paper? Snap a photo, trace it on the field, and download it as a clean Word doc for your playbook.
        Drawing the play yourself is how you learn it.
      </p>

      {/* Playbook */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: plays.length ? 12 : 0 }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            My Playbook <span style={{ color: T.inkSoft, fontWeight: 500 }}>({plays.length})</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select onChange={(e) => { if (e.target.value) { startNew(e.target.value); e.target.value = ""; } }} defaultValue="" style={{ ...input, width: "auto", fontFamily: "'Oswald', sans-serif", fontWeight: 600, color: T.navyMid }}>
              <option value="" disabled>+ New play…</option>
              {Object.entries(FORMATIONS).map(([k, f]) => <option key={k} value={k}>{f.name}</option>)}
            </select>
            {plays.length > 1 && (
              <button style={btn(true)} disabled={!!busy} onClick={() => exportDocs(plays, `${safeFileName(playerName ? `${playerName} Playbook` : "Playbook")}.docx`, playerName ? `${playerName}'s Playbook` : "My Playbook")}>
                <FileText size={14} /> Whole Playbook (.docx)
              </button>
            )}
          </div>
        </div>
        {plays.length === 0 ? (
          <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 8 }}>No saved plays yet. Build one below and hit Save.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {plays.map((p) => (
              <div key={p.id} style={{ border: `2px solid ${p.id === play.id ? T.gold : T.creamLine}`, borderRadius: 6, overflow: "hidden", background: "#fff" }}>
                <button onClick={() => openPlay(p)} style={{ display: "block", width: "100%", padding: 0, border: "none", background: "none", cursor: "pointer" }}>
                  <FieldSvg play={p} showPhoto={false} />
                </button>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", gap: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                  <button onClick={() => deletePlay(p)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft, padding: 2 }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 1: sketch */}
      <div style={card}>
        {stepTitle(1, "Upload your sketch (optional)")}
        <input ref={photoInputRef} id="play-photo" type="file" accept="image/*" onChange={onPhotoPicked} style={{ display: "none" }} />
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="play-photo" style={btn(true)}><Upload size={14} /> {play.photo ? "Replace photo" : "Choose photo"}</label>
          {play.photo && (
            <>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <input type="checkbox" checked={showPhoto} onChange={(e) => setShowPhoto(e.target.checked)} /> Show behind field
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                Fade <input type="range" min={0.1} max={0.9} step={0.05} value={photoOpacity} onChange={(e) => setPhotoOpacity(Number(e.target.value))} />
              </label>
              <button style={btn(false)} onClick={() => update((c) => ({ ...c, photo: null, photoW: 0, photoH: 0 }))}><Trash2 size={14} /> Remove</button>
            </>
          )}
        </div>
        <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
          Tip: take the photo straight on with the line of scrimmage level. Got several plays on one sheet? Crop to one play first, or just look at the photo and copy it.
          Your photo stays on your device. It isn't uploaded anywhere.
        </div>
      </div>

      {/* Step 2: draw */}
      <div style={card}>
        {stepTitle(2, "Trace the play")}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <button style={btn(false, mode === "move")} onClick={() => setMode("move")}><Move size={14} /> Move</button>
          <button style={btn(false, mode === "add")} onClick={() => setMode("add")}><UserPlus size={14} /> Add Player</button>
          <button style={btn(false, mode === "route")} onClick={() => setMode("route")}><PenLine size={14} /> Draw Route</button>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginLeft: 4 }}>
            <input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} /> Snap routes to yard lines
          </label>
        </div>

        {mode === "add" && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
            {LABELS.map((l) => (
              <button key={l} style={chip(addLabel === l && !customLabel, LABEL_COLORS[l])} onClick={() => { setAddLabel(l); setCustomLabel(""); }}>{l}</button>
            ))}
            <input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} maxLength={3} placeholder="Other" style={{ ...input, width: 70 }} />
          </div>
        )}

        <div style={{ fontSize: 12.5, color: T.navyMid, background: T.cream, borderRadius: 4, padding: "7px 10px", marginBottom: 10 }}>{modeHelp[mode]}</div>

        <div style={{ border: `1px solid ${T.creamLine}`, borderRadius: 6, overflow: "hidden" }}>
          <FieldSvg play={play} selectedId={selectedId} photoOpacity={photoOpacity} showPhoto={showPhoto} svgRef={svgRef} handlers={handlers} />
        </div>

        {selected && (
          <div style={{ marginTop: 14, border: `2px solid ${selected.color}`, borderRadius: 6, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...chip(true, selected.color), cursor: "default" }}>{selected.label}</span>
                <input value={selected.label} maxLength={3} onChange={(e) => updatePlayer(selected.id, (p) => ({ ...p, label: e.target.value.toUpperCase() }))} style={{ ...input, width: 64 }} aria-label="Player letter" />
                <input type="color" value={selected.color} onChange={(e) => updatePlayer(selected.id, (p) => ({ ...p, color: e.target.value }))} style={{ width: 34, height: 32, border: "none", background: "none", padding: 0 }} aria-label="Colour" />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button style={btn(false)} onClick={() => { setMode("route"); }}><PenLine size={14} /> Draw</button>
                <button style={btn(false)} disabled={!selected.route.points.length} onClick={() => updatePlayer(selected.id, (p) => withAutoDepth({ ...p, route: { ...p.route, points: p.route.points.slice(0, -1) } }))}><Undo2 size={14} /> Undo point</button>
                <button style={btn(false)} disabled={!selected.route.points.length} onClick={() => updatePlayer(selected.id, (p) => ({ ...p, depth: "", depthAuto: true, route: { ...p.route, points: [] } }))}>Clear route</button>
                <button style={btn(false)} onClick={() => { update((c) => ({ ...c, players: c.players.filter((p) => p.id !== selected.id) })); setSelectedId(null); }}><Trash2 size={14} /> Remove</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={label}>Assignment</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <select value="" onChange={(e) => e.target.value && updatePlayer(selected.id, (p) => ({ ...p, assignment: e.target.value }))} style={{ ...input, width: "auto" }}>
                    <option value="">Pick a route…</option>
                    {ROUTE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <input value={selected.assignment} onChange={(e) => updatePlayer(selected.id, (p) => ({ ...p, assignment: e.target.value }))} placeholder="e.g. 5-yard cross, keep running to the far sideline" style={{ ...input, flex: 1, minWidth: 200 }} />
                </div>
              </div>
              <div>
                <span style={label}>Depth (yards)</span>
                <input value={selected.depth} inputMode="numeric" maxLength={3} onChange={(e) => updatePlayer(selected.id, (p) => (e.target.value === "" ? withAutoDepth({ ...p, depthAuto: true }) : { ...p, depth: e.target.value, depthAuto: false }))} placeholder="auto when route breaks" style={input} />
              </div>
              <div>
                <span style={label}>Route ends with</span>
                <select value={selected.route.end} onChange={(e) => updatePlayer(selected.id, (p) => ({ ...p, route: { ...p.route, end: e.target.value } }))} style={input}>
                  <option value="arrow">Arrow (keep running)</option>
                  <option value="dot">Dot (settle / sit)</option>
                  <option value="block">T (block)</option>
                  <option value="none">Nothing</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "flex-end" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <input type="checkbox" checked={selected.route.curved} onChange={(e) => updatePlayer(selected.id, (p) => ({ ...p, route: { ...p.route, curved: e.target.checked } }))} /> Smooth curves
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <input type="checkbox" checked={selected.route.dashed} onChange={(e) => updatePlayer(selected.id, (p) => ({ ...p, route: { ...p.route, dashed: e.target.checked } }))} /> Dashed (motion)
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: notes */}
      <div style={card}>
        {stepTitle(3, "Name it and add notes")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 12 }}>
          <div>
            <span style={label}>Play name</span>
            <input value={play.name} onChange={(e) => update((c) => ({ ...c, name: e.target.value }))} placeholder="e.g. Rubber" style={input} />
          </div>
          <div>
            <span style={label}>Formation</span>
            <input value={play.formation} onChange={(e) => update((c) => ({ ...c, formation: e.target.value }))} placeholder="e.g. 2x2 Spread, Trips Right" style={input} />
          </div>
        </div>
        {[
          ["concept", "Concept: what is this play trying to do?", "e.g. Three crossers at 4, 5 and 6 yards with verticals clearing the top."],
          ["qbRead", "QB read: where does the ball go?", "e.g. Pre-snap: check the safeties. Read the Mike. Shallow, then 5, then 6. Hit the open window."],
          ["notes", "Coaching notes (optional)", "e.g. W can't drift. Stay flat at 4 so you don't run into H."],
        ].map(([k, l, ph]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <span style={label}>{l}</span>
            <textarea value={play[k]} onChange={(e) => update((c) => ({ ...c, [k]: e.target.value }))} placeholder={ph} style={{ ...input, minHeight: 60, resize: "vertical" }} />
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button style={btn(true)} onClick={savePlay}><Save size={14} /> Save to Playbook</button>
          <button style={btn(false)} disabled={!!busy} onClick={() => exportDocs([{ ...play, name: play.name.trim() || "Untitled play" }], `${safeFileName(play.name)}.docx`, play.name || "Play")}>
            <Download size={14} /> Download Word Doc
          </button>
          <button style={btn(false)} onClick={duplicatePlay}><Copy size={14} /> Duplicate</button>
          {dirty && <span style={{ fontSize: 12, color: T.red }}>Unsaved changes</span>}
        </div>
        {(busy || message) && <div style={{ marginTop: 10, fontSize: 13, color: T.navyMid, fontWeight: 600 }}>{busy || message}</div>}
      </div>
    </div>
  );
}
