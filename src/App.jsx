import React, { useState, useEffect, useRef } from "react";
import { Shield, Zap, Eye, Activity, Footprints, BookOpen, Users, Route, Flag, Video, Heart, Timer, Snowflake, RefreshCw, Check, Upload, Plus, ChevronLeft, Play, MessageCircleQuestion, Send, Clock, User, Pencil, Brain, Trophy, Target, CheckSquare, Award, Lock, TrendingUp, X as XIcon } from "lucide-react";

const TOKENS = {
  navyDeep: "#0f1d33",
  navyMid: "#1e3a63",
  navyLine: "#2c4770",
  gold: "#c8a24a",
  goldBright: "#e0c073",
  cream: "#f2ead9",
  creamLine: "#d8cba9",
  red: "#b23a2c",
  ink: "#241f16",
  inkSoft: "#5a5140",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');`;

const SUBJECTS = [
  {
    id: "glossary",
    title: "Glossary & Rules",
    icon: BookOpen,
    blurb: "The CFL vocabulary every QB should know",
    lessons: [
      {
        title: "Field dimensions and 12-man personnel",
        items: [
          { name: "Field width", description: "65 yards wide, versus 53.3 yards in the NFL.", note: "More sideline-to-sideline space to both defend and attack." },
          { name: "Field length & end zones", description: "110 yards between goal lines, with 20-yard end zones on each end (150 yards total).", note: "Longer end zones change red zone strategy significantly." },
          { name: "12 players per side", description: "Canadian football fields one more player per side than the American game.", note: "That extra player is almost always used as a receiver/blocker hybrid — the slotback." },
        ],
      },
      {
        title: "The three-down system and its impact",
        items: [
          { name: "Three downs to gain 10 yards", description: "CFL offenses get only three downs (versus four in the NFL/NCAA) to make a first down.", note: "This makes every first and second down more valuable — offenses take fewer conservative shots." },
          { name: "Faster-paced game", description: "With fewer downs to work with, CFL offenses tend to throw more and play at a quicker tempo.", note: "Expect more passing concepts and less pure ball-control football." },
        ],
      },
      {
        title: "Pre-snap motion and the 1-yard DB rule",
        items: [
          { name: "Legal forward motion", description: "Unlike the NFL, CFL players can legally move forward (not just laterally) before the snap.", note: "Use it to diagnose coverage or gain a running start before the ball is snapped." },
          { name: "1-yard neutral zone for DBs", description: "Defensive backs must line up at least one yard off the line of scrimmage before the snap.", note: "This creates a natural cushion for receivers at the start of every play." },
        ],
      },
      {
        title: "Common protections, audibles, and route trees",
        items: [
          { name: "Pass protection calls", description: "Pre-snap calls that tell the offensive line which gaps or rushers to prioritize.", note: "Know your protection before the snap so you know where your hot read lives if it breaks down." },
          { name: "Audibles", description: "A new play or adjustment called at the line based on what the defense shows.", note: "Audibles are a tool, not a requirement — only change the play when you have a clear, confident read." },
          { name: "Route tree", description: "A numbered system (e.g. 1 = flat, 9 = go) used to quickly communicate pass routes.", note: "Learning the route tree numbers speeds up play calls and reduces confusion in the huddle." },
        ],
      },
      {
        title: "General terms: leverage, gap, hash marks, and shorthand",
        items: [
          { name: "Leverage", description: "A defender's positioning relative to a receiver — inside, outside, or over top.", note: "Reading leverage tells you which way a receiver is likely to break open." },
          { name: "Gap", description: "The space between two offensive linemen, labeled A through D gaps moving outward from the center.", note: "Run plays and blitzes are often named for which gap they attack." },
          { name: "Hash marks", description: "The lines running down the middle of the field marking where the ball is placed to start each play.", note: "CFL hashes sit wider apart than NFL hashes, affecting field-side vs. boundary-side play design." },
        ],
      },
    ],
  },
  {
    id: "positions",
    title: "Positions on the Field",
    icon: Users,
    blurb: "Who lines up where, and what each job means",
    lessons: [
      {
        title: "The offensive line: center, guards, and tackles",
        items: [
          { name: "Center", description: "Snaps the ball and typically makes protection calls for the line.", note: "Build a strong rapport with your center — they're often your first line of communication up front." },
          { name: "Guards", description: "Line up on either side of the center, handling interior run blocking and pass protection.", note: "Interior pressure up the middle is usually the fastest threat to a QB — know your guards' matchups." },
          { name: "Tackles", description: "Line up outside the guards, primarily responsible for edge protection.", note: "Your blindside tackle's matchup is one of the most important things to check pre-snap." },
        ],
      },
      {
        title: "Skill positions: QB, RB/FB, and receivers",
        items: [
          { name: "Running back / fullback", description: "Primary ball carriers and additional pass protectors out of the backfield.", note: "Know your back's protection assignment — it affects who you can trust to pick up a blitzer." },
          { name: "Receivers / slotbacks", description: "Primary pass targets, with slotbacks adding a run-blocking element unique to the CFL's 12-man game.", note: "Understand each receiver's strengths — some win with speed, others with route precision." },
        ],
      },
      {
        title: "The defensive front and linebackers",
        items: [
          { name: "Defensive line", description: "Linemen responsible for stopping the run and rushing the passer directly across from the offensive line.", note: "Identify which defensive linemen are the real pass-rush threats pre-snap." },
          { name: "Linebackers", description: "Play behind the line, responsible for run support, coverage, and blitzing.", note: "The Mike linebacker is usually your key pre-snap protection reference point." },
        ],
      },
      {
        title: "The secondary: cornerbacks, halfbacks, and safeties",
        items: [
          { name: "Cornerbacks", description: "Cover receivers on the outside, in either man or zone coverage.", note: "Watch their alignment depth — tight press coverage often signals man." },
          { name: "Safeties (and CFL halfbacks)", description: "Play deep support, with the CFL's extra defensive back (halfback) adding another deep coverage option.", note: "Count the deep defenders before the snap — one versus two tells you a lot about the coverage shell." },
        ],
      },
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Flag,
    blurb: "Commanding the huddle and earning trust",
    lessons: [
      {
        title: "Commanding the huddle and calling the play with confidence",
        items: [
          { name: "Clear, confident communication", description: "Calling the play loudly, clearly, and without hesitation builds trust in the huddle.", note: "Even if you're unsure, project confidence — hesitation in the huddle spreads to the whole offense." },
        ],
      },
      {
        title: "Staying composed under pressure and after mistakes",
        items: [
          { name: "The next-play mindset", description: "Treating every play — good or bad — as separate from the next one.", note: "Develop a short, personal reset routine (a breath, a phrase) to use after a mistake." },
        ],
      },
      {
        title: "Earning trust: accountability and leading by example",
        items: [
          { name: "Owning mistakes publicly", description: "Taking responsibility for errors in front of the team builds credibility, even when it's uncomfortable.", note: "Teammates trust QBs who hold themselves accountable first, before pointing elsewhere." },
          { name: "Leading by example", description: "Showing up prepared, working hard in practice, and modeling the standard you expect from others.", note: "Your effort in practice sets the ceiling for how hard your teammates will work." },
        ],
      },
      {
        title: "Communicating with coaches, teammates, and officials",
        items: [
          { name: "Talking with coaches", description: "Clear, respectful communication about what you're seeing on the field helps coaches adjust the game plan.", note: "Bring information, not just problems — describe what you're seeing, not just what isn't working." },
          { name: "Talking with officials", description: "Staying calm and respectful with officials, even after a tough call.", note: "Arguing with officials rarely changes a call and can cost your team a penalty — stay composed." },
        ],
      },
    ],
  },
  {
    id: "mentalgame",
    title: "Mental Game & Confidence",
    icon: Heart,
    blurb: "The mindset behind the mechanics",
    lessons: [
      {
        title: "Pre-game and pre-play routines",
        note: "Do yourself a favor and put the phone down 90 minutes before a game, and 60 minutes before you go to sleep the night before. Also — lots of water.",
        items: [
          { name: "Visualization before the game", description: "Mentally rehearsing reads, throws, and situations before you ever step on the field.", note: "A few minutes of focused visualization the night before or morning of a game builds real familiarity with what you might see." },
          { name: "A simple pre-play routine", description: "A short, repeatable habit — a breath, a cue word, a look at the sideline — used before every single snap.", note: "Consistency matters more than the specific routine — the same routine every play builds calm under pressure." },
        ],
      },
      {
        title: "Handling nerves and pressure",
        items: [
          { name: "Simple breathing techniques", description: "A slow, controlled breath (in for 4, hold for 4, out for 4) lowers physical tension in high-pressure moments.", note: "Practice this in low-stakes situations first so it's second nature when the game gets tense." },
          { name: "Reframing nerves as readiness", description: "The physical feeling of nerves and the feeling of excitement are almost identical — the difference is how you label it.", note: "Telling yourself \"I'm excited\" instead of \"I'm nervous\" can genuinely change how you perform." },
        ],
      },
      {
        title: "Bouncing back after a mistake",
        items: [
          { name: "A short reset routine", description: "A physical or mental cue — a breath, a phrase, a glance at the sideline — used immediately after a mistake to move on.", note: "The goal isn't to forget the mistake, it's to stop it from affecting the very next play." },
          { name: "Separate the play from your worth", description: "One incompletion or interception is information about that play, not a verdict on you as a player.", note: "The QBs who recover fastest treat mistakes as data, not identity." },
        ],
      },
      {
        title: "Building confidence through preparation",
        items: [
          { name: "Confidence comes from reps, not hype", description: "Real confidence is built through practice, film study, and repetition — not by trying to feel confident on command.", note: "If you're underprepared, no mental trick will replace the confidence that comes from doing the work." },
          { name: "Trust your training in the moment", description: "In live action, the best QBs trust their preparation and react, rather than overthinking every decision.", note: "Overanalyzing in real time usually slows you down — trust the reps you've already put in." },
        ],
      },
    ],
  },
  {
    id: "offense",
    title: "Offensive Concepts",
    icon: Zap,
    blurb: "Attacking a 65-yard-wide, 110-yard field",
    lessons: [
      {
        title: "Route concepts built for the wide field",
        items: [
          { name: "Using the extra width", description: "The 65-yard field creates more room outside the numbers than the American game.", note: "Routes that break toward the sideline have real extra space to work with — use it to stretch corners." },
          { name: "Horizontal stretches", description: "Concepts that spread receivers side to side force defenders to choose who to cover.", note: "On a wider field, horizontal-stretch concepts are even more effective than in American football." },
        ],
      },
      {
        title: "Using the 12th eligible receiver",
        items: [
          { name: "The extra blocker/receiver", description: "With 12 players on the field, CFL offenses get one more eligible receiver than the NFL's 11.", note: "That extra body is often a slotback — someone who can both block and release into routes." },
          { name: "Slotback role", description: "A hybrid position between receiver and running back, common in CFL formations.", note: "Watch how slotbacks are used pre-snap; their alignment often hints at run or pass." },
        ],
      },
      {
        title: "Attacking 20-yard end zones in the red zone",
        items: [
          { name: "Deeper end zones", description: "CFL end zones run 20 yards deep versus the NFL's 10, opening up more room near the goal line.", note: "Fade and corner routes have more room to work with — the defense can't crowd the goal line as tightly." },
          { name: "Red zone patience", description: "With more depth to work with, offenses can still run genuine vertical routes deep into the red zone.", note: "Don't abandon vertical concepts near the goal line just because you're close — there's more room than you think." },
        ],
      },
      {
        title: "Play-action off the base run game",
        items: [
          { name: "Selling the run fake", description: "Effective play-action starts with mimicking the exact footwork and ball placement of the real run play.", note: "If your fake doesn't match your run action, linebackers won't bite and the play loses its purpose." },
          { name: "Attacking vacated zones", description: "Linebackers who step up to defend the run leave space behind them for play-action throws.", note: "Look to throw into the area a linebacker just vacated — usually over the middle or to a crossing route." },
        ],
      },
      {
        title: "Common formations: spread offense, I-formation, and full house backfield",
        note: "These are common formations, but each offense will name them individually — including the individual position letters.",
        items: [
          {
            name: "Spread Offense",
            formationDiagram: {
              title: "Spread Offense",
              positions: [
                { x: 20, y: 165, label: "X" }, { x: 90, y: 165, label: "H" },
                { x: 200, y: 195, label: "QB", color: "#b23a2c" }, { x: 235, y: 190, label: "F" },
                { x: 310, y: 165, label: "Y" }, { x: 380, y: 165, label: "Z" },
              ],
            },
            description: "QB lines up in shotgun with receivers spread wide across the field, built to create space and simplify reads.",
            note: "Gives the QB more time and a clearer pre-snap view of the defense — a good foundation for young QBs learning to read coverage.",
          },
          {
            name: "I-Formation",
            formationDiagram: {
              title: "I-Formation",
              positions: [
                { x: 30, y: 165, label: "X" }, { x: 200, y: 165, label: "QB", color: "#b23a2c" },
                { x: 200, y: 187, label: "FB" }, { x: 200, y: 209, label: "RB" },
                { x: 370, y: 165, label: "Z" },
              ],
            },
            description: "QB under center with a fullback and running back stacked behind him — a run-heavy, physical look.",
            note: "Good for establishing downhill running and setting up play-action off it.",
          },
          {
            name: "Full House Backfield",
            formationDiagram: {
              title: "Full House Backfield",
              positions: [
                { x: 30, y: 165, label: "X" }, { x: 200, y: 165, label: "QB", color: "#b23a2c" },
                { x: 160, y: 195, label: "HB" }, { x: 200, y: 200, label: "FB" }, { x: 240, y: 195, label: "HB" },
                { x: 370, y: 165, label: "Z" },
              ],
            },
            description: "Three backs — typically a fullback flanked by two halfbacks — aligned behind the QB, all available as blockers or ball carriers.",
            note: "A power-running look with extra lead blockers; also a strong disguise for play-action since every back is a run threat.",
          },
          {
            name: "Trips / Bunch Sets",
            formationDiagram: {
              title: "Trips / Bunch Sets",
              positions: [
                { x: 30, y: 165, label: "X" }, { x: 200, y: 195, label: "QB", color: "#b23a2c" }, { x: 165, y: 190, label: "F" },
                { x: 305, y: 165, label: "H" }, { x: 340, y: 158, label: "Y" }, { x: 370, y: 172, label: "Z" },
              ],
            },
            description: "Three receivers aligned tightly to one side, creating natural picks and rub routes.",
            note: "Great for beating man coverage — the tight spacing makes it hard for defenders to stay attached.",
          },
        ],
      },
      {
        title: "Widely used pass plays: four verticals, mesh, smash, and flood",
        note: "These are common plays used across Canadian football. In most situations, the individual offence will rename these plays into their own terminology.",
        items: [
          {
            kind: "rich", name: "Four Verticals",
            routesDiagram: {
              title: "Four Verticals",
              routes: [
                { x: 30, label: "X", type: "go" }, { x: 115, label: "H", type: "seam" },
                { x: 200, label: "F", type: "checkrelease" },
                { x: 285, label: "Y", type: "seam" }, { x: 370, label: "Z", type: "go" },
              ],
            },
            summary: "Attack every deep third and quarter with four vertical stems. It forces safeties to pick a side and leaves seams open — the classic way to attack Cover 2 and Cover 3.",
            badgesLabel: "ROUTES",
            badges: [
              { label: "X", text: "9 (Go / fade)" }, { label: "H", text: "Seam" },
              { label: "Z", text: "9 (Go / fade)" }, { label: "Y", text: "Seam" },
              { label: "F", text: "Check-release / swing" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Cover 2 (hit the seam between the halves), Cover 3 (sit in the deep-third windows).",
            qbRead: "Read the safeties. Vs. 2-high: if a safety sinks to help the corner, throw the seam behind him. Vs. 1-high: throw the post or seam away from the single safety's leverage.",
            coachingKey: "Ball must be out on rhythm — the windows close fast. Throw to grass, not to a covered man.",
          },
          {
            kind: "rich", name: "Mesh",
            routesDiagram: {
              title: "Mesh",
              routes: [
                { x: 30, label: "X", type: "dig" }, { x: 115, label: "H", type: "crossShallow" },
                { x: 200, label: "F", type: "checkrelease" },
                { x: 285, label: "Y", type: "hitch" }, { x: 370, label: "Z", type: "crossShallow" },
              ],
            },
            summary: "Two shallow crossing routes underneath rub off man coverage while deeper routes hold the linebackers and safeties in place.",
            badgesLabel: "ROUTES",
            badges: [
              { label: "Z", text: "Shallow cross" }, { label: "H", text: "Shallow cross" },
              { label: "X", text: "Deep dig / hold" }, { label: "Y", text: "Spot (sit behind mesh)" },
              { label: "F", text: "Check-release / swing" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Man coverage — the rub at the mesh point creates natural separation — and tight zone coverage underneath.",
            qbRead: "Work the mesh first — find whichever crosser cleared the traffic. If both are covered, come off to the spot route sitting behind the mesh.",
            coachingKey: "Throw the crosser in stride, leading him across the field — a late throw gets undercut by trailing defenders.",
          },
          {
            kind: "rich", name: "Smash",
            routesDiagram: {
              title: "Smash",
              routes: [
                { x: 30, label: "X", type: "hitch" }, { x: 115, label: "H", type: "flat" },
                { x: 200, label: "F", type: "checkrelease" },
                { x: 285, label: "Y", type: "dig" }, { x: 370, label: "Z", type: "corner" },
              ],
            },
            summary: "A high-low stretch on the corner: a quick hitch underneath and a corner route over top attack whichever leverage the flat defender takes.",
            badgesLabel: "ROUTES",
            badges: [
              { label: "X", text: "Hitch (5 yards)" }, { label: "Z", text: "Corner (12+ yards)" },
              { label: "H", text: "Flat / check" }, { label: "Y", text: "Dig (over middle)" },
              { label: "F", text: "Check-release" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Cover 2 (the corner squats on the hitch, opening the corner route over top) and press-man on the outside.",
            qbRead: "Identify the flat/curl defender pre-snap. If he sits on the hitch, throw the corner behind him. If he bails with the corner route, throw the hitch underneath.",
            coachingKey: "Know your matchup before the snap — this is a full-field high-low, not a 50/50 guess.",
          },
          {
            kind: "rich", name: "Flood",
            routesDiagram: {
              title: "Flood",
              routes: [
                { x: 30, label: "X", type: "out" }, { x: 115, label: "H", type: "outShort" },
                { x: 200, label: "F", type: "flat" },
                { x: 285, label: "Y", type: "dig" }, { x: 370, label: "Z", type: "go" },
              ],
            },
            summary: "Three receivers stack at different depths to the same side — flat, intermediate, deep out — overloading a single defender with more routes than he can cover.",
            badgesLabel: "ROUTES",
            badges: [
              { label: "X", text: "Deep out (18 yards)" }, { label: "H", text: "Intermediate out (10 yards)" },
              { label: "F", text: "Flat" }, { label: "Z", text: "Deep clear (backside)" },
              { label: "Y", text: "Backside dig" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Cover 3 and zone coverages rolled toward the flood side — one defender simply has too many routes to cover.",
            qbRead: "Read high to low: deep out first, then the intermediate route, then the flat as your checkdown.",
            coachingKey: "Don't skip levels — working top to bottom keeps every throw available as the play develops.",
          },
          {
            kind: "rich", name: "Slant-Flat",
            routesDiagram: {
              title: "Slant-Flat",
              routes: [
                { x: 30, label: "X", type: "flat" }, { x: 115, label: "H", type: "crossShallow" },
                { x: 200, label: "F", type: "checkrelease" },
                { x: 285, label: "Y", type: "hitch" }, { x: 370, label: "Z", type: "slant" },
              ],
            },
            summary: "A fast-hitting horizontal stretch: an inside slant and an outside flat route attack the corner's leverage before he can close either window.",
            badgesLabel: "ROUTES",
            badges: [
              { label: "Z", text: "Slant" }, { label: "X", text: "Flat (quick release)" },
              { label: "H", text: "Shallow cross (backside)" }, { label: "Y", text: "Hot / check" },
              { label: "F", text: "Protection / check-release" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Off coverage and soft zone corners — the corner can't be in two places at once.",
            qbRead: "Pre-snap, read the corner's leverage. If he's outside leverage, throw the slant. If he's inside/soft, throw the flat before he can drive on it.",
            coachingKey: "This is a rhythm throw — decide before the snap and let it go on time, not after you see the corner move.",
          },
          {
            kind: "rich", name: "Y-Cross",
            routesDiagram: {
              title: "Y-Cross",
              routes: [
                { x: 30, label: "X", type: "go" }, { x: 115, label: "H", type: "dig" },
                { x: 200, label: "F", type: "checkrelease" },
                { x: 285, label: "Y", type: "crossDeep" }, { x: 370, label: "Z", type: "go" },
              ],
            },
            summary: "A tight end or slotback runs a deep crossing route from one side of the formation to the other, hunting soft spots between zone defenders.",
            badgesLabel: "ROUTES",
            badges: [
              { label: "Y", text: "Deep cross (15+ yards)" }, { label: "H", text: "Dig (underneath cross)" },
              { label: "X", text: "Go (hold safety)" }, { label: "Z", text: "Go (hold safety)" },
              { label: "F", text: "Check-release" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Cover 1 and Cover 3 — the crosser runs away from man defenders and settles into the seams of zone coverage.",
            qbRead: "Hitch up in the pocket as the crosser clears traffic, and lead him away from the trailing defender's pursuit angle.",
            coachingKey: "Patience matters — this route takes time to develop. Don't bail the pocket early and rush the throw.",
          },
        ],
      },
    ],
  },
  {
    id: "defense",
    title: "Defensive Concepts",
    icon: Shield,
    blurb: "Reading coverages and fronts on a 12-man field",
    lessons: [
      {
        title: "Reading Cover 1 vs. Cover 2 shells",
        items: [
          { name: "Cover 1 (Man-Free)", description: "One deep safety, with everyone else in man coverage underneath.", note: "Pre-snap, look for a single safety sitting in the middle of the field with no help over the top." },
          { name: "Cover 2 (Two-Deep)", description: "Two safeties split the deep field into halves, with corners squatting on shorter routes.", note: "Attack the deep middle seam between the two safeties, or throw underneath before the corners can sink." },
          { name: "Reading the middle safety", description: "The clearest pre-snap indicator of Cover 1 vs. Cover 2 is where the safety or safeties line up before the snap.", note: "One safety in the middle usually means Cover 1; two safeties split wide usually means Cover 2." },
        ],
      },
      {
        title: "Recognizing blitz vs. drop-eight looks",
        items: [
          { name: "Blitz indicators", description: "Extra defenders creeping toward the line, with linebackers or DBs showing near the interior gaps.", note: "Watch for defenders inching forward and shifting weight onto their front foot just before the snap." },
          { name: "Drop-eight (bluff) looks", description: "A defense shows blitz numbers pre-snap but drops extra defenders into coverage after the ball is snapped.", note: "Don't panic into a forced throw at a look that disappears — trust your protection and read what actually develops." },
          { name: "Hot routes", description: "Pre-determined quick throws built to beat pressure before it arrives.", note: "Know your hot route before the snap so you're not deciding under pressure in real time." },
        ],
      },
      {
        title: "Zone vs. man leverage cues",
        items: [
          { name: "Man coverage leverage", description: "Defenders mirror the receiver's release and stay square to him rather than to the ball.", note: "If a defender's hips and eyes are on your receiver instead of the QB, it's likely man coverage." },
          { name: "Zone coverage leverage", description: "Defenders sit in an area and keep their eyes on the QB, passing receivers off to the next defender.", note: "If a defender's eyes are on you instead of the receiver, it's likely zone — throw with anticipation into open grass." },
        ],
      },
      {
        title: "Defending the wider CFL field in coverage",
        items: [
          { name: "Extra width to defend", description: "At 65 yards wide, CFL corners and safeties must cover more grass than the NFL's 53.3-yard field requires.", note: "The extra width often creates bigger throwing lanes outside the numbers — look for it." },
          { name: "Motion stresses leverage", description: "Legal forward pre-snap motion can force a defense to declare man or zone before the ball is even snapped.", note: "Send a receiver in motion specifically to get a coverage read before you commit to the play." },
        ],
      },
      {
        title: "Common fronts: 4-3, 3-4, and CFL-style over/under looks",
        items: [
          {
            kind: "rich", name: "4-3 Front",
            diagramConfig: {
              title: "4-3 Front", zoneMode: "none",
              dl: [155, 180, 220, 245], lb: [140, 200, 260],
              markers: [
                { x: 60, y: 55, label: "CB", color: "#3b6ea5", sub: "CB", bob: false },
                { x: 340, y: 55, label: "CB", color: "#3b6ea5", sub: "CB", bob: false },
                { x: 150, y: 35, label: "S", color: "#b23a2c", sub: "Safety", bob: false },
                { x: 250, y: 35, label: "S", color: "#b23a2c", sub: "Safety", bob: false },
              ],
            },
            summary: "Four down linemen and three linebackers — a balanced front that defends the run and rushes the passer with roughly equal numbers everywhere.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "DL", text: "4 down linemen" }, { label: "LB", text: "3 linebackers" },
              { label: "DB", text: "4–5 defensive backs" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "Attack the seams between the three linebackers with quick, timing-based throws before they can drop into their zones.",
            qbRead: "Identify the Mike pre-snap — he's your protection anchor and usually the free hitter on any blitz.",
            coachingKey: "A balanced front rarely tips its hand — trust your protection call and take what the coverage gives you.",
          },
          {
            kind: "rich", name: "3-4 Front",
            diagramConfig: {
              title: "3-4 Front", zoneMode: "none",
              dl: [170, 200, 230], lb: [100, 160, 240, 300],
              markers: [
                { x: 60, y: 55, label: "CB", color: "#3b6ea5", sub: "CB", bob: false },
                { x: 340, y: 55, label: "CB", color: "#3b6ea5", sub: "CB", bob: false },
                { x: 150, y: 35, label: "S", color: "#b23a2c", sub: "Safety", bob: false },
                { x: 250, y: 35, label: "S", color: "#b23a2c", sub: "Safety", bob: false },
              ],
            },
            summary: "Three down linemen and four linebackers, often disguising which two linebackers are rushing and which two are dropping into coverage.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "DL", text: "3 down linemen" }, { label: "LB", text: "4 linebackers" },
              { label: "DB", text: "4–5 defensive backs" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "The extra rusher can come from either edge — throw hot or check the protection to whichever side shows pressure earliest.",
            qbRead: "Watch both outside linebackers right up to the snap; late movement from either one usually signals the real rush lane.",
            coachingKey: "Don't lock onto one side of the formation — a 3-4's disguise works best against QBs who stop scanning early.",
          },
          {
            kind: "rich", name: "CFL Over/Under Shift",
            diagramConfig: {
              title: "CFL Over/Under Shift", zoneMode: "none",
              dl: [150, 175, 200, 225], lb: [150, 210],
              shift: { side: "left" },
              markers: [],
            },
            summary: "Canadian defensive lines often shift their strength toward the field's wide or short side rather than staying balanced.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "OVER", text: "Line shaded to strength side" }, { label: "UNDER", text: "Line shaded away from strength" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "The extra run defender lines up on the side the front is shaded toward — expect more room to the opposite side.",
            qbRead: "Check which side the line is shaded to pre-snap; it tells you where the extra gap defender is and where the room is.",
            coachingKey: "Use this shift to help pick your run-play direction or find the softer coverage side on pass plays.",
          },
        ],
      },
      {
        title: "Widely used coverages: Cover 2, Cover 3, and nickel/dime packages",
        note: "To keep it simple, the number of defenders deep refers to the name of the coverage. For example, Cover 3 means three defenders deep, and Cover 1 means one defender deep. The position of the defender who covers the flat also contributes to the name — for example, Cover 3 Hold means three defenders deep, where the Half(back) has the flat.",
        items: [
          {
            kind: "rich", name: "Cover 2",
            diagramConfig: {
              title: "Cover 2", zoneMode: "halves",
              markers: [
                { x: 133, y: 45, label: "S", color: "#b23a2c", sub: "Safety (deep half)", bob: true },
                { x: 267, y: 45, label: "S", color: "#b23a2c", sub: "Safety (deep half)", bob: true },
                { x: 60, y: 142, label: "CB", color: "#3b6ea5", sub: "CB (squat)", subBelow: true, bob: true },
                { x: 340, y: 142, label: "CB", color: "#3b6ea5", sub: "CB (squat)", subBelow: true, bob: true },
              ],
            },
            summary: "Two safeties split the deep field into halves while corners squat underneath on shorter routes.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "DEEP", text: "2 safeties, deep halves" }, { label: "UNDER", text: "5 defenders underneath" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "Attack the deep middle seam between the two safeties, or throw underneath before the corners can sink into their zones.",
            qbRead: "Watch the corners' depth pre-snap — squatting corners with two deep safeties is the clearest Cover 2 tell.",
            coachingKey: "Timing beats talent here — get the ball to the seam before the safety can drive on it.",
          },
          {
            kind: "rich", name: "Cover 3", diagram: "hold",
            summary: "Three deep defenders each cover a third of the field, with four defenders underneath — a common way to defend the CFL's wider field.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "DEEP", text: "3 defenders, deep thirds" }, { label: "UNDER", text: "4 defenders underneath" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "The deep middle third is the toughest area to attack — work the flats and intermediate seams outside the numbers instead.",
            qbRead: "A single deep-middle safety rotating over is the tell — expect help over the top on any post route.",
            coachingKey: "Be patient with the deep middle — force the underneath defenders to declare before you commit to a throw.",
          },
          {
            kind: "rich", name: "Cover 3 – Cut", diagram: "cut",
            summary: "A Canadian football staple variant of Cover 3: corners play a low outside zone while the halfbacks play deep, splitting the deep-third responsibility between the corner and halfback on each side.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "CB", text: "Low zone, outside #1" }, { label: "HB", text: "Deep zone, outside #2" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "Light underneath over the #2 receiver (where the halfback vacated) and light against the run — attack that space with quick, intermediate throws.",
            qbRead: "Watch the corner: if he gets two vertical releases to his side, he'll carry the outside one deep, leaving the low zone open underneath.",
            coachingKey: "Cut is built to shut down four verticals down the sideline — don't force the deep ball outside; work underneath instead.",
          },
          {
            kind: "rich", name: "Cover 3 – Hold", diagram: "hold",
            summary: "The other common Cover 3 variant: both corners and the free safety play deep zones, with everyone else holding low zones underneath.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "CB/FS", text: "3 deep-zone defenders" }, { label: "LOW", text: "Remaining defenders underneath" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "Strong against four verticals since three true deep defenders are in place, but the flats can be soft — work them early before the defense adjusts.",
            qbRead: "If both corners and the safety are all sitting deep pre-snap with nobody rotating, expect Hold rather than Cut.",
            coachingKey: "This coverage wants to push you into tougher, farther throws — don't settle for the safe flat when a better window is available underneath.",
          },
          {
            kind: "rich", name: "Nickel / Dime Packages",
            diagramConfig: {
              title: "Nickel / Dime Packages", zoneMode: "none", lb: [200],
              markers: [
                { x: 115, y: 150, label: "NB", color: "#8e6bb0", sub: "Nickel: +1 DB (5 total)", subBelow: true, bob: true },
                { x: 285, y: 150, label: "DB", color: "#8e6bb0", sub: "Dime: +2 DB (6 total)", subBelow: true, bob: true },
              ],
            },
            summary: "An extra defensive back — nickel (5th DB) or dime (6th DB) — replaces a linebacker to add coverage against extra receivers.",
            badgesLabel: "STRUCTURE",
            badges: [
              { label: "NICKEL", text: "5 DBs on the field" }, { label: "DIME", text: "6 DBs on the field" },
            ],
            keyLabel: "HOW TO BEAT IT",
            keyText: "Lighter boxes mean less run support — designed runs and draws can find extra room against these packages.",
            qbRead: "Count the defensive backs pre-snap. A 6th DB (dime) almost always signals the defense expects a pass.",
            coachingKey: "Don't force a pass into extra coverage just because it's there — these packages are often your best run downs.",
          },
        ],
      },
    ],
  },
  {
    id: "presnap",
    title: "Pre-Snap Reads",
    icon: Eye,
    blurb: "Diagnosing the defense before the ball is snapped",
    lessons: [
      {
        title: "Identifying the Mike and protection slide",
        items: [
          { name: "Finding the Mike linebacker", description: "The Mike (middle linebacker) is usually the protection point — the player the offensive line's slide is set toward.", note: "Identifying the Mike correctly is the foundation of a clean pre-snap protection call." },
          { name: "Protection slide", description: "The direction the offensive line shifts its blocking priority based on the identified Mike and expected pressure.", note: "If the defense shifts after your call, be ready to adjust protection or find your hot route." },
        ],
      },
      {
        title: "Reading safety rotation pre-snap",
        note: "Find the free safety. If he's in the middle, that means Cover 1 or Cover 3. Two defenders deep means Cover 2. Zero defenders deep means Cover Zero. Keep in mind these defenders may be shifting and rotating pre-snap to confuse you.",
        items: [
          { name: "Two-high shells", description: "Both safeties align deep before the snap, often signaling zone coverage.", note: "Watch if they stay two-high after the snap or rotate down — that tells you the real coverage." },
          { name: "One-high shells", description: "A single deep safety, often signaling man coverage or a single-high zone look.", note: "One-high usually means more one-on-one matchups outside — know your receivers' releases." },
        ],
      },
      {
        title: "Using legal forward motion to diagnose coverage",
        items: [
          { name: "Motion as a coverage detector", description: "Sending a receiver in forward motion can force the defense to reveal man or zone before the snap.", note: "If a defender moves with the receiver in motion, it's man. If defenders stay put and pass him off, it's zone." },
        ],
      },
      {
        title: "Spotting DBs off the 1-yard neutral zone",
        items: [
          { name: "The 1-yard cushion", description: "CFL defensive backs must line up at least a yard off the ball before the snap.", note: "That guaranteed cushion is built-in separation — plan quick, timing-based throws to take advantage of it." },
        ],
      },
    ],
  },
  {
    id: "mechanics",
    title: "QB Mechanics",
    icon: Activity,
    blurb: "Grip, base, and the throwing motion",
    lessons: [
      {
        title: "Base and grip fundamentals",
        items: [
          { name: "Athletic base", description: "Feet roughly shoulder-width apart, knees slightly bent, weight balanced on the balls of the feet.", note: "A poor base is the root cause of most accuracy issues — check this first." },
          { name: "Grip", description: "Fingers spread comfortably across the laces with a small gap between the ball and the palm.", note: "A grip that's too tight often causes tension that hurts release and accuracy." },
        ],
      },
      {
        title: "Hip and shoulder sequencing",
        items: [
          { name: "Kinetic sequencing", description: "Power should flow from the ground up — legs, then hips, then shoulders, then arm.", note: "If the arm starts the throw before the hips rotate, velocity and accuracy both suffer." },
          { name: "Hip rotation", description: "The hips should begin rotating toward the target just before the shoulders follow.", note: "Watch that the front hip doesn't fly open too early — it should lead the throw, not rush it." },
        ],
      },
      {
        title: "Footwork through 3-, 5-step, and shotgun drops",
        items: [
          { name: "3-step drop", description: "A quick, short drop used for timing-based short passes.", note: "Feet should be set and ready to throw by the third step — no wasted motion." },
          { name: "5-step drop", description: "A deeper drop that gives intermediate routes more time to develop.", note: "Stay balanced through the drop; rushing it often leads to throwing off-platform." },
          { name: "Shotgun footwork", description: "Starting from a deeper alignment changes drop timing and requires a compact, efficient set-up.", note: "Shotgun reduces the drop depth needed — focus on a quick, balanced set rather than a long drop." },
        ],
      },
      {
        title: "Throwing on the run and on rollouts",
        items: [
          { name: "Rollout mechanics", description: "Keep shoulders square to the target as long as possible while moving, rather than drifting sideways.", note: "Momentum should carry toward the target, not sideways — this keeps throws accurate on the move." },
          { name: "Throwing across the body", description: "Occasionally necessary, but riskier and less accurate than throwing off the correct foot.", note: "Practice this deliberately, but avoid it as a first option when a cleaner throw is available." },
        ],
      },
      {
        title: "Coaches & creators we recommend",
        note: "These are outside creators, not part of QB Vision 360 — worth following for extra reps and perspective on mechanics.",
        items: [
          { kind: "creator", name: "QBMotion", handle: "@QBMotion", platform: "YouTube", url: "https://youtube.com/@QBMotion", description: "Rob Williams, QB movement kinesiologist — works with CFL, NFL, and NCAA quarterbacks on throwing mechanics." },
          { kind: "creator", name: "First Down Training", handle: "@firstdowntraining", platform: "YouTube", url: "https://www.youtube.com/@firstdowntraining", description: "Grant Caraway's QB/WR training channel — footwork, mechanics, and camp-style drill work." },
          { kind: "creator", name: "YV QB Academy", handle: "@YVQBACADEMY", platform: "YouTube", url: "https://www.youtube.com/@YVQBAcademy", description: "Yale Vannoy Quarterback Academy — San Antonio-based QB training, drills, and highlight breakdowns." },
          { kind: "creator", name: "J. Christensen QB", handle: "@j_christensenqb", platform: "Instagram", url: "https://www.instagram.com/j_christensenqb/?hl=en", description: "QB training content and reps on Instagram." },
          { kind: "creator", name: "KOACH10", handle: "@koach10", platform: "Instagram", url: "https://www.instagram.com/koach10/?hl=en", description: "QB coaching and training content on Instagram." },
        ],
      },
    ],
  },
  {
    id: "drillsfootwork",
    title: "Drills & Footwork",
    icon: Footprints,
    blurb: "Reps that build clean, repeatable habits",
    lessons: [
      {
        title: "Ladder and cone footwork drills",
        items: [
          { name: "Ladder drills", description: "Quick, controlled steps through a footwork ladder to build rapid foot speed and coordination.", note: "Focus on precision over speed at first — speed comes naturally as footwork cleans up.", videoId: "4vh6qAO_uFc", videoLabel: "The Best Ladder Drill Footwork Routine" },
          { name: "Cone weaves", description: "Weaving through cones while maintaining a throwing-ready posture.", note: "Keep your eyes up and shoulders level throughout — don't let footwork drills break your throwing posture.", videoId: "9Eruhnda2jU", videoLabel: "Cone Weave Drill: Quarterbacks (USA Football)" },
        ],
      },
      {
        title: "3-step / 5-step drop timing",
        items: [
          { name: "Drop-and-throw reps", description: "Practicing drop footwork paired immediately with a simulated or live throw.", note: "Time your drop to match the route depth it's paired with — a rushed drop often means a late or inaccurate throw.", videoId: "JLzVt2gR2wQ", videoLabel: "8 New QB Footwork Drills" },
        ],
      },
      {
        title: "Pocket movement and escape drills",
        items: [
          { name: "Climbing the pocket", description: "Stepping up into a clean pocket rather than immediately retreating from pressure.", note: "Most young QBs bail backward too early — practice stepping up first when there's a clean lane.", videoId: "thxQUFhwwlo", videoLabel: "Russell Wilson's Pocket Presence & Footwork Drills" },
          { name: "Escape drills", description: "Practicing controlled movement outside the pocket while keeping eyes downfield.", note: "Escaping the pocket doesn't mean abandoning the play — keep progressing through reads as you move.", videoId: "thxQUFhwwlo", videoLabel: "Russell Wilson's Pocket Presence & Footwork Drills" },
        ],
      },
      {
        title: "Deep ball touch and accuracy reps",
        items: [
          { name: "Touch vs. velocity", description: "Deep balls need arc and touch, not just raw arm strength, to be catchable in stride.", note: "Practice varying trajectory intentionally — a flat, hard deep ball is much harder to catch.", videoId: "IQ9vK5eexrI", videoLabel: "QB Drill for Throwing the Deep Ball (Coach Sink)" },
          { name: "Leading the receiver", description: "Placing the ball where a receiver is going, not where they currently are.", note: "Aim deep throws to the receiver's outside shoulder, away from defenders, whenever possible.", videoId: "IQ9vK5eexrI", videoLabel: "QB Drill for Throwing the Deep Ball (Coach Sink)" },
        ],
      },
    ],
  },
  {
    id: "running",
    title: "The Running Game",
    icon: Route,
    blurb: "Reading blocks and setting up play-action",
    lessons: [
      {
        title: "Inside zone vs. outside zone blocking",
        items: [
          {
            kind: "rich", name: "Inside Zone",
            runDiagram: {
              title: "Inside Zone",
              blockers: [
                { x: 150, y: 192, toX: 168, toY: 178 }, { x: 175, y: 192, toX: 193, toY: 178 },
                { x: 200, y: 192, toX: 218, toY: 178 }, { x: 225, y: 192, toX: 243, toY: 178 },
                { x: 250, y: 192, toX: 268, toY: 178 },
              ],
              backPath: "M 230 216 L 213 195 L 208 150 L 208 45",
            },
            summary: "All offensive linemen zone step playside, working combo blocks up to the second level. The running back reads the first threat past the center and picks his gap.",
            badgesLabel: "ASSIGNMENTS",
            badges: [
              { label: "OL", text: "Zone step playside, combo to linebackers" },
              { label: "RB", text: "Aim at the playside guard, one-cut off the first color" },
              { label: "QB", text: "Clean mesh and ride — get out of the way once the read is made" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Defenses that flow hard laterally — the cutback lane opens when linebackers overrun the zone action.",
            qbRead: "Sell the fake with your eyes and shoulders even after the handoff — a lazy fake lets backside pursuit chase the play down.",
            coachingKey: "The best inside zone runs aren't schemed open — they're one-cut, decisive reads off a patient offensive line.",
          },
          {
            kind: "rich", name: "Outside Zone",
            runDiagram: {
              title: "Outside Zone",
              blockers: [
                { x: 150, y: 192, toX: 178, toY: 172 }, { x: 175, y: 192, toX: 203, toY: 172 },
                { x: 200, y: 192, toX: 228, toY: 172 }, { x: 225, y: 192, toX: 253, toY: 172 },
                { x: 250, y: 192, toX: 278, toY: 172 },
              ],
              backPath: "M 230 216 Q 285 195 298 160 L 298 45",
            },
            summary: "Linemen block laterally toward the sideline (reach blocks), stretching the defense before the back presses the edge and cuts upfield off the first color he sees.",
            badgesLabel: "ASSIGNMENTS",
            badges: [
              { label: "OL", text: "Lateral reach steps, stretch the defense wide" },
              { label: "RB", text: "Press the edge, one-cut off the force defender" },
              { label: "QB", text: "Full ride and fake — hold the backside defender with your eyes" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Aggressive, gap-shooting fronts — the stretch and cutback punish defenders who attack straight upfield instead of playing their zone.",
            qbRead: "Even on a straight handoff, your eyes and fake matter — a convincing fake slows the backside edge rusher and buys the back an extra half-second.",
            coachingKey: "Outside zone takes longer to hit than inside zone — teach patience so the back doesn't cut it back too early.",
          },
        ],
      },
      {
        title: "Power, counter, and draw: gap-scheme and misdirection runs",
        items: [
          {
            kind: "rich", name: "Power (Power O)",
            runDiagram: {
              title: "Power (Power O)",
              blockers: [
                { x: 150, y: 192, toX: 158, toY: 175 }, { x: 200, y: 192, toX: 210, toY: 178 },
                { x: 225, y: 192, toX: 243, toY: 178 }, { x: 250, y: 192, toX: 270, toY: 178 },
              ],
              pullers: [
                { x: 175, y: 192, toX: 262, toY: 176 },
              ],
              backPath: "M 230 216 L 260 195 L 262 150 L 258 45",
            },
            summary: "Down blocks seal the play-side while a backside guard pulls to kick out the edge defender, and the running back follows a lead blocker through the hole.",
            badgesLabel: "ASSIGNMENTS",
            badges: [
              { label: "OL", text: "Down blocks playside, backside guard pulls" },
              { label: "RB", text: "Follow the puller, hit downhill off his block" },
              { label: "QB", text: "Clean handoff, then get depth away from the puller's path" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Light or undersized fronts — the extra puller creates a numbers advantage at the point of attack.",
            qbRead: "Time the handoff so the ball arrives just as the puller clears — too early and the back outruns his blocker.",
            coachingKey: "Downhill and physical — Power rewards a running back who presses the hole hard rather than dancing behind it.",
          },
          {
            kind: "rich", name: "Counter",
            runDiagram: {
              title: "Counter",
              blockers: [
                { x: 200, y: 192, toX: 212, toY: 176 }, { x: 225, y: 192, toX: 245, toY: 176 },
                { x: 250, y: 192, toX: 272, toY: 176 },
              ],
              pullers: [
                { x: 175, y: 192, toX: 145, toY: 174 }, { x: 150, y: 192, toX: 122, toY: 174 },
              ],
              backPath: "M 230 216 L 195 208 L 148 192 L 143 148 L 140 45",
            },
            summary: "A misdirection run: the backfield action goes one way while the ball actually goes the other, often with a puller (or two) leading the way opposite the fake.",
            badgesLabel: "ASSIGNMENTS",
            badges: [
              { label: "OL", text: "Down blocks away from the play, backside puller(s) lead" },
              { label: "RB", text: "Counter step, then follow the pullers through the opposite hole" },
              { label: "QB", text: "Sell the initial fake hard before handing off against the grain" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Aggressive, fast-flowing defenses — overrunning linebackers chase the fake and get caught out of position.",
            qbRead: "Your first fake step is the whole play — a half-hearted counter step tips the defense and kills the misdirection.",
            coachingKey: "Counter lives or dies on selling the opposite direction first — practice the fake as hard as the handoff itself.",
          },
          {
            kind: "rich", name: "Draw",
            runDiagram: {
              title: "Draw",
              blockers: [
                { x: 150, y: 192, toX: 150, toY: 200 }, { x: 175, y: 192, toX: 175, toY: 200 },
                { x: 200, y: 192, toX: 200, toY: 200 }, { x: 225, y: 192, toX: 225, toY: 200 },
                { x: 250, y: 192, toX: 250, toY: 200 },
              ],
              backPath: "M 200 214 L 200 206 L 200 202 L 200 150 L 200 45",
            },
            summary: "A run play disguised as a pass — the offensive line shows pass protection before blocking down, and the back delays before bursting through the middle.",
            badgesLabel: "ASSIGNMENTS",
            badges: [
              { label: "OL", text: "Pass-set, then block down at the snap of the read" },
              { label: "RB", text: "Delay behind the QB, then hit the opening late" },
              { label: "QB", text: "Drop like a pass play, then turn and hand off on the delay" },
            ],
            keyLabel: "WHAT IT ATTACKS",
            keyText: "Aggressive pass rushes — defensive linemen rushing upfield create running lanes as they blow past their gaps.",
            qbRead: "Your drop needs to look identical to a real dropback — any hesitation gives away the disguise.",
            coachingKey: "Timing is everything on a draw — too early and the rush hasn't committed yet; too late and the lanes have closed.",
          },
        ],
      },
      {
        title: "Reading the mesh point on run/pass options",
        items: [
          { name: "The mesh point", meshDiagram: true, description: "The moment the QB and running back meet during a handoff or option read.", note: "Keep your eyes on the read defender, not the ball, through the mesh point." },
        ],
      },
      {
        title: "Setting up play-action off the run game",
        items: [
          { name: "Matching the run action", description: "Effective play-action requires footwork and ball-handling that looks identical to the real run play.", note: "If your run game and play-action footwork don't match, defenses will diagnose it quickly." },
        ],
      },
      {
        title: "Finding running lanes on the wider field",
        items: [
          { name: "Extra width to work with", description: "The CFL's wider field gives ball carriers more room to bounce runs outside than the American game.", note: "Backs and read-option QBs should be coached to recognize when bouncing a run outside is available." },
        ],
      },
    ],
  },
  {
    id: "filmstudy",
    title: "Film Study & Opponent Prep",
    icon: Video,
    blurb: "Turning film into a usable gameday plan",
    lessons: [
      {
        title: "What to look for on defensive film",
        items: [
          { name: "Formation & personnel tendencies", description: "Track what personnel groupings and fronts a defense shows on early downs versus passing downs.", note: "A defense that stays in the same personnel regardless of down and distance is easier to prepare for than one that substitutes often." },
          { name: "Coverage tendencies by down and distance", description: "Many defenses lean on certain coverages in specific situations — for example, more zone on 2nd-and-long, more man on 3rd-and-short.", note: "Chart coverage by down and distance across a few games before trusting a tendency as real." },
          { name: "Pre-snap tells", description: "Individual defenders often give away blitz or coverage with their stance, depth, or eye discipline before the snap.", note: "Look for the same defender tipping the same thing multiple times before building a read around it." },
        ],
      },
      {
        title: "Building a scouting report",
        items: [
          { name: "Narrow it to what matters", description: "Identify the defense's top two or three coverages and blitzes rather than trying to catalog everything they run.", note: "A scouting report that's too long won't get used in the huddle — keep it to what you'll actually reference." },
          { name: "Note individual weaknesses", description: "A linebacker who struggles in coverage, a corner who bites on double moves, a safety who's slow to rotate — these are gold.", note: "Individual tendencies are often more reliable and more exploitable than team-wide ones." },
          { name: "Make it usable on gameday", description: "Format the report as short, scannable notes rather than long paragraphs.", note: "If you can't glance at it between series and use it immediately, it's not built for gameday." },
        ],
      },
      {
        title: "Situational tendencies: down, distance, and field position",
        items: [
          { name: "Third-down tendencies", description: "Third down is often where a defense's true coverage and pressure preferences show up most clearly.", note: "Chart third-down calls separately from first- and second-down film — they often look completely different." },
          { name: "Red zone adjustments", description: "With less field to defend, coverages often tighten and blitz frequency can change significantly in the red zone.", note: "Study the red zone as its own mini-scouting-report, since CFL's 20-yard end zones make this area even more important." },
          { name: "Two-minute / hurry-up looks", description: "Defenses often simplify their calls in two-minute situations to avoid confusion at a fast tempo.", note: "A simplified defense is often a more predictable one — know their go-to look when the clock is running." },
        ],
      },
      {
        title: "Building a film study routine",
        items: [
          { name: "Set a consistent weekly schedule", description: "Watching film in short, regular sessions beats one long cram session before gameday.", note: "Even 20 minutes a day adds up to far more retained information than a single 2-hour session." },
          { name: "Watch with one purpose per session", description: "Focus each viewing on a single question — coverage tendencies one day, blitz tells the next — instead of trying to see everything at once.", note: "Trying to track too many things in one viewing usually means you really see none of them clearly." },
          { name: "Keep notes you'll actually use", description: "Write down what you find in a format you can reference quickly during the week and on gameday.", note: "Your notes are only as good as how usable they are in the moment you need them." },
        ],
      },
    ],
  },
  {
    id: "clocksituational",
    title: "Clock & Situational Management",
    icon: Timer,
    blurb: "Making the right call for the moment on the clock",
    lessons: [
      {
        title: "Two-minute drill fundamentals",
        items: [
          { name: "Stopping the clock on purpose", description: "Sideline routes and out-of-bounds throws are tools to stop the clock without needing a timeout.", note: "Know before the snap whether the play is designed to go out of bounds if it's not a big gain." },
          { name: "Timeout priorities", description: "Timeouts late in a half are one of your most valuable resources — use them with a clear reason, not out of panic.", note: "A rushed, unclear play call is often worse than burning a timeout to get it right." },
        ],
      },
      {
        title: "Clock management basics: when to hurry, when to slow down",
        items: [
          { name: "Protecting a lead", description: "When ahead late, running plays and staying in bounds can bleed clock and shorten the game for the opponent.", note: "Know your team's clock-killing plays before you need them in the moment." },
          { name: "Playing from behind", description: "When trailing late, no-huddle tempo and clock-stopping throws help maximize the number of plays left.", note: "Speak with your coach beforehand about exactly when the no-huddle turns on." },
        ],
      },
      {
        title: "End-of-half and end-of-game decisions",
        items: [
          { name: "Kneel it or keep playing?", description: "With a safe lead and little time left, taking a knee to end the clock is often the smart, low-risk choice.", note: "Know your team's threshold for kneeling versus still trying to add points — this should be a coach's call, not a guess." },
          { name: "Watch for the single (rouge)", description: "In the CFL, a missed field goal or punt into the end zone that isn't returned out gives the opposing team one point.", note: "Late in a half or game, this CFL-specific rule can quietly change the math on whether to attempt a long kick." },
        ],
      },
      {
        title: "Timeout management",
        items: [
          { name: "Avoiding unnecessary delay penalties", description: "A timeout used to avoid a delay-of-game penalty is sometimes worth it, but it's a real cost late in a half.", note: "The best way to avoid this trade-off is a clean, practiced play-call process that doesn't run the clock down." },
          { name: "Communicating clock strategy with coaches", description: "Make sure you and your coaching staff agree on the plan before critical clock situations happen, not during them.", note: "A quick sideline conversation before a two-minute situation saves confusion when it matters most." },
        ],
      },
    ],
  },
  {
    id: "armcare",
    title: "Arm Care & Recovery",
    icon: Snowflake,
    blurb: "Simple habits that protect your throwing arm long-term",
    lessons: [
      {
        title: "Cooling down after throwing",
        items: [
          { name: "Light movement, not a dead stop", description: "Walking and light stretching after a heavy throwing session helps your arm and body transition out of intense activity.", note: "Going from max effort straight to sitting still is harder on your body than a short, easy cooldown." },
          { name: "Rehydrate right after", description: "Drinking water as soon as a session ends helps recovery start on the right foot.", note: "Don't wait until you're thirsty — get ahead of it as soon as practice or the game ends." },
        ],
      },
      {
        title: "Managing throw counts and rest",
        items: [
          { name: "Be aware of your total reps", description: "It's not just about how hard you throw — how many throws you make in a session adds up too.", note: "A big throwing day should usually be followed by a lighter day, not another big one." },
          { name: "Build in lighter arm days", description: "Alternating harder and easier days gives your arm real time to recover between heavy sessions.", note: "Talk with your coach about spacing out your hardest throwing days across the week." },
        ],
      },
      {
        title: "Simple recovery habits",
        items: [
          { name: "Ice and rest for soreness", description: "Many athletes use ice and rest to manage normal soreness after a hard session.", note: "Follow whatever your coach, trainer, or parent recommends specifically — this is general awareness, not a treatment plan." },
          { name: "Sleep is part of recovery", description: "Your arm and body recover while you sleep, not just when you're resting during the day.", note: "A consistent, decent night's sleep is one of the most underrated recovery tools available to you." },
        ],
      },
      {
        title: "Know the difference between soreness and pain",
        items: [
          { name: "Normal soreness vs. something more", description: "General muscle fatigue after a hard session is common; sharp, sudden, or worsening pain is not.", note: "When in doubt, treat it as worth mentioning rather than guessing on your own." },
          { name: "Speak up early", description: "Telling a coach or parent about arm soreness early is always the right move, even if it feels minor.", note: "This app can't diagnose anything — if something doesn't feel right, talk to a coach, parent, or medical professional." },
        ],
      },
    ],
  },
  {
    id: "nextlevel",
    title: "Path to the Next Level",
    icon: TrendingUp,
    blurb: "What scouts look for, and how to get seen",
    lessons: [
      {
        title: "What scouts and recruiters look for",
        items: [
          { name: "Football IQ and decision-making", description: "Evaluators increasingly value quick, accurate decision-making and pre-snap reads, not just physical tools.", note: "Film that shows you diagnosing coverage and getting the ball out on time stands out more than one big-arm throw." },
          { name: "Leadership and coachability", description: "How a QB communicates, handles mistakes, and responds to coaching is heavily weighed — it's hard to fake on film or in person.", note: "Camps and combines are also evaluating how you carry yourself, not just your throws." },
          { name: "Consistency over highlight plays", description: "A body of work showing repeatable, sound mechanics matters more than a handful of highlight-reel throws.", note: "Build a reel that shows a range of throws and reads, not just your best five plays." },
        ],
      },
      {
        title: "How camps and combines work",
        items: [
          { name: "What to expect", description: "Camps typically combine measurable testing (40-yard dash, vertical, etc.) with on-field QB-specific drills and live reps.", note: "Prepare like it's a real evaluation — first impressions start from the very first drill." },
          { name: "Measurables vs. on-field performance", description: "Numbers get you noticed, but on-field decision-making and accuracy are what get you remembered.", note: "Don't neglect testing prep, but don't let it replace real reps and film study either." },
        ],
      },
      {
        title: "Building a highlight reel",
        items: [
          { name: "What to include", description: "A mix of full plays — not just the throw — showing pre-snap reads, footwork, and release, across different coverages and situations.", note: "Include a few full drives or games, not just cut-up highlights — evaluators want to see decision-making in context." },
          { name: "Where to host it", description: "Hudl is the standard platform used across Canadian and U.S. recruiting for sharing game and highlight film.", note: "Keep your Hudl link updated in Build Your Profile so it's easy to share when the time comes." },
          { name: "Length and pacing", description: "A tight, well-organized reel (a few minutes) is more effective than a long, unedited one.", note: "Lead with your strongest, most representative plays first — evaluators often don't watch to the end." },
        ],
      },
      {
        title: "Understanding the recruiting process",
        items: [
          { name: "Start early, stay patient", description: "Recruiting timelines vary widely, and meaningful interest often builds gradually rather than all at once.", note: "Keep training and improving regardless of where you are in the process — that's the part you control." },
          { name: "Academics matter too", description: "For U Sports and many programs, academic eligibility is just as important as on-field performance.", note: "Keep your grades up alongside your football development — it keeps every door open." },
        ],
      },
    ],
  },
];

const SUPPORT_URL = ""; // add a real Ko-fi / Buy Me a Coffee / PayPal.me link here

// NOTE: this is a basic client-side passcode gate, not real authentication.
// It keeps casual players out of Coach View, but anyone who reads this
// file's source can see the passcode. Replace with real backend auth
// before relying on this for anything sensitive.
const COACH_PASSCODE = "Oscar123";

const WALKTHROUGH_STEPS = [
  { icon: null, title: "Welcome to QB Vision 360", body: "A quick look around before you dive in — this'll take about 30 seconds." },
  { icon: BookOpen, title: "Lessons", body: "13 subjects covering everything from mechanics to reading defenses — built specifically for the Canadian game." },
  { icon: Footprints, title: "Drills", body: "Log your reps and track progress on footwork, drop timing, pocket movement, and deep balls." },
  { icon: Brain, title: "Quiz", body: "Test yourself any time — a fresh mix of questions pulled from every subject." },
  { icon: Target, title: "Build a Plan", body: "Set a season goal, pick your focus areas, and track milestones as you go." },
  { icon: Play, title: "Film Room & Ask the Coach", body: "Upload a clip, ask a question about it, or ask the coach anything else — it'll be waiting for your next session." },
  { icon: Trophy, title: "Achievements", body: "Earn badges as you train. Check your progress any time from the Achievements tab." },
];

const BADGES = [
  { id: "first-steps", name: "First Steps", description: "Complete your first lesson.", icon: BookOpen, check: (s) => s.completedLessons >= 1 },
  { id: "getting-started", name: "Getting Started", description: "Complete 5 lessons.", icon: BookOpen, check: (s) => s.completedLessons >= 5 },
  { id: "bookworm", name: "Bookworm", description: "Complete 25 lessons.", icon: Brain, check: (s) => s.completedLessons >= 25 },
  { id: "completionist", name: "Completionist", description: "Complete every lesson in the app.", icon: Trophy, check: (s) => s.totalLessons > 0 && s.completedLessons >= s.totalLessons },
  { id: "subject-master", name: "Subject Master", description: "Complete every lesson in at least one subject.", icon: Target, check: (s) => s.anySubjectComplete },
  { id: "well-rounded", name: "Well-Rounded", description: "Complete at least one lesson in every subject.", icon: Users, check: (s) => s.everySubjectStarted },
  { id: "drill-sergeant", name: "Drill Sergeant", description: "Hit your target reps on any drill.", icon: Footprints, check: (s) => s.anyDrillMaxed },
  { id: "iron-arm", name: "Iron Arm", description: "Hit your target reps on all four drills.", icon: Activity, check: (s) => s.allDrillsMaxed },
  { id: "goal-setter", name: "Goal Setter", description: "Set your season goal in Build a Plan.", icon: Flag, check: (s) => !!(s.plan.seasonGoal && s.plan.seasonGoal.trim()) },
  { id: "locked-in", name: "Locked In", description: "Pick 3 focus areas in Build a Plan.", icon: CheckSquare, check: (s) => s.plan.focusAreas.length >= 3 },
  { id: "reflective", name: "Reflective", description: "Log 5 entries in your Reflection Log.", icon: BookOpen, check: (s) => s.reflections.length >= 5 },
  { id: "milestone-maker", name: "Milestone Maker", description: "Complete a milestone in Build a Plan.", icon: Trophy, check: (s) => s.milestones.some((m) => m.done) },
  { id: "profile-complete", name: "Profile Complete", description: "Fill out your full Build Your Profile.", icon: User, check: (s) => PROFILE_QUESTIONS.every((q) => s.profile[q.id] && s.profile[q.id].trim()) },
];

const JOKES = [
  "Why did the coach go to the bank? To get his quarterback.",
  "Why don't quarterbacks get cold on the sideline? They've always got a lot of fans.",
  "What do you call a QB who won't throw deep? A chicken arm.",
  "Why did the receiver bring a pencil to practice? To draw up his own route.",
  "What did the QB say to the mirror before the game? \"Nice reads, self.\"",
  "Why did the offensive line bring a ladder to the game? To take their blocking to the next level.",
  "Why was the football team's Wi-Fi terrible? Too many dropped connections.",
  "How does a QB stay so calm in the pocket? Lots of reps... and deep breaths.",
  "Why did the CFL QB bring an extra teammate to the huddle? Because their offense always has 12 men — one more than you're used to.",
  "Why did the running back cross the field? To get to the other side... untouched.",
  "What's a kicker's favorite subject? Field goal-ometry.",
  "Why did the QB study math before the game? So he could figure out his angles on the deep ball.",
];

const QUOTES = [
  { text: "It's not wanting to win that makes you a winner; it's refusing to fail.", author: "Peyton Manning" },
  { text: "I've never left the field saying, \"I could have done more to get ready.\" And that gives me peace of mind.", author: "Peyton Manning" },
  { text: "If you want to perform at the highest level, then you have to prepare at the highest level.", author: "Tom Brady" },
  { text: "If you don't play to win, don't play at all.", author: "Tom Brady" },
  { text: "Confidence is a very fragile thing.", author: "Joe Montana" },
  { text: "Always be prepared to start.", author: "Joe Montana" },
  { text: "I've never played the game for the stats, or with goals in mind or worrying about a legacy.", author: "Anthony Calvillo, CFL Hall of Famer" },
  { text: "You just have to keep believing in yourself, and go wherever you have to go to prove you can do it.", author: "Warren Moon, CFL & NFL Hall of Famer" },
  { text: "There's a lot of hard practices, a lot of injuries, a lot of tough losses, a lot of things that can beat you down a bit. But when you do get on top and do get to win... it's just so rewarding.", author: "Ricky Ray, CFL Hall of Famer" },
];

const DRILLS = [
  { id: "ladder", title: "Footwork Ladder", unit: "reps", target: 50, step: 5 },
  { id: "dropTiming", title: "3-Step / 5-Step Drop Timing", unit: "reps", target: 30, step: 5 },
  { id: "pocketEscape", title: "Pocket Escape Reps", unit: "reps", target: 20, step: 5 },
  { id: "deepBall", title: "Deep Ball Touch Reps", unit: "throws", target: 25, step: 5 },
];

function CompassMark({ size = 40 }) {
  // Cropped to the circular emblem from the official QB Vision 360 logo artwork
  // (original bounding box of the compass circle: cx=340 cy=195 r=150)
  return (
    <svg width={size} height={size} viewBox="190 45 300 300" aria-hidden="true">
      <circle cx="340" cy="195" r="150" fill="#1e3a63" />
      <circle cx="340" cy="195" r="150" fill="none" stroke="#c8a24a" strokeWidth="4" />
      <circle cx="340" cy="195" r="140" fill="none" stroke="#c8a24a" strokeWidth="1" strokeDasharray="2 6" opacity="0.6" />
      <line x1="340" y1="45" x2="340" y2="70" stroke="#c8a24a" strokeWidth="3" />
      <line x1="340" y1="320" x2="340" y2="345" stroke="#c8a24a" strokeWidth="3" />
      <line x1="465" y1="195" x2="490" y2="195" stroke="#c8a24a" strokeWidth="3" />
      <line x1="190" y1="195" x2="215" y2="195" stroke="#c8a24a" strokeWidth="3" />
      <line x1="435.5" y1="99.5" x2="446" y2="89" stroke="#c8a24a" strokeWidth="2" />
      <line x1="435.5" y1="290.5" x2="446" y2="301" stroke="#c8a24a" strokeWidth="2" />
      <line x1="244.5" y1="290.5" x2="234" y2="301" stroke="#c8a24a" strokeWidth="2" />
      <line x1="244.5" y1="99.5" x2="234" y2="89" stroke="#c8a24a" strokeWidth="2" />
      <g transform="translate(340,95)">
        <circle r="18" fill="#12233f" stroke="#c8a24a" strokeWidth="2" />
        <line x1="-9" y1="0" x2="9" y2="0" stroke="#c8a24a" strokeWidth="2.2" />
        <rect x="-12" y="-6" width="3" height="12" rx="1" fill="#c8a24a" />
        <rect x="-15.5" y="-4" width="2.5" height="8" rx="1" fill="#c8a24a" />
        <rect x="9" y="-6" width="3" height="12" rx="1" fill="#c8a24a" />
        <rect x="13" y="-4" width="2.5" height="8" rx="1" fill="#c8a24a" />
      </g>
      <g transform="translate(440,195)">
        <circle r="18" fill="#12233f" stroke="#c8a24a" strokeWidth="2" />
        <rect x="-6" y="5" width="12" height="3" rx="1" fill="#c8a24a" />
        <path d="M -1 -8 L 2 -8 L 2 -5 Q 5 -4 6 -1 Q 7 1 5 2 L 6 4 L 3 4 Q 2 5 0 5 L -3 5 L -3 1 Q -3 -3 -1 -5 Z" fill="#c8a24a" />
        <path d="M -3 -3 L -1.3 -2 L -3 -1 Z" fill="#12233f" />
        <path d="M -3 0.3 L -1.3 1.3 L -3 2.3 Z" fill="#12233f" />
        <circle cx="3" cy="-5.5" r="0.7" fill="#12233f" />
      </g>
      <g transform="translate(340,295) rotate(-6)">
        <circle r="18" fill="#12233f" stroke="#c8a24a" strokeWidth="2" />
        <g fill="none" stroke="#c8a24a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="-8" r="2.1" fill="#c8a24a" stroke="none" />
          <path d="M 6 -6 L -3 3" />
          <path d="M -3 3 L -9 -1" />
          <path d="M -3 3 L 3 0 L 1 7" />
          <path d="M 4 -6 L -4 -8" />
          <path d="M 4 -6 L 9 -10 L 11 -7" />
        </g>
      </g>
      <g transform="translate(240,195)">
        <circle r="18" fill="#12233f" stroke="#c8a24a" strokeWidth="2" />
        <g fill="#c8a24a">
          <path d="M 0 -8 L 1 -5.2 L 3.8 -5.2 L 1.6 -3.5 L 2.4 -0.7 L 0 -2.4 L -2.4 -0.7 L -1.6 -3.5 L -3.8 -5.2 L -1 -5.2 Z" />
          <path d="M 7.6 -2.5 L 8.6 0.3 L 11.4 0.3 L 9.2 2 L 10 4.8 L 7.6 3.1 L 5.2 4.8 L 6 2 L 3.8 0.3 L 6.6 0.3 Z" transform="translate(-3.8,0)" />
          <path d="M 4.7 6.5 L 5.7 9.3 L 8.5 9.3 L 6.3 11 L 7.1 13.8 L 4.7 12.1 L 2.3 13.8 L 3.1 11 L 0.9 9.3 L 3.7 9.3 Z" transform="translate(0,-6.5)" />
          <path d="M -4.7 6.5 L -3.7 9.3 L -0.9 9.3 L -3.1 11 L -2.3 13.8 L -4.7 12.1 L -7.1 13.8 L -6.3 11 L -8.5 9.3 L -5.7 9.3 Z" transform="translate(0,-6.5)" />
          <path d="M -7.6 -2.5 L -6.6 0.3 L -3.8 0.3 L -6 2 L -5.2 4.8 L -7.6 3.1 L -10 4.8 L -9.2 2 L -11.4 0.3 L -8.6 0.3 Z" transform="translate(3.8,0)" />
        </g>
      </g>
      <text x="340" y="65" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fill="#c8a24a">N</text>
      <circle cx="340" cy="195" r="70" fill="#c0392b" />
      <circle cx="340" cy="195" r="52" fill="#e8dcc4" />
      <circle cx="340" cy="195" r="34" fill="#c0392b" />
      <circle cx="340" cy="195" r="16" fill="#e8dcc4" />
      <g transform="translate(340,195) rotate(-25)">
        <path d="M -28 0 Q -15 -15 0 -15 Q 15 -15 28 0 Q 15 15 0 15 Q -15 15 -28 0 Z" fill="#6b3d1f" stroke="#3f2410" strokeWidth="1.5" />
        <path d="M -22 -3 Q -8 -10 6 -8 Q 2 -3 -10 0 Z" fill="#8a5730" opacity="0.7" />
        <path d="M -26 0 Q 0 -13 26 0" fill="none" stroke="#3f2410" strokeWidth="1" />
        <path d="M -26 0 Q 0 13 26 0" fill="none" stroke="#3f2410" strokeWidth="1" />
        <line x1="-13" y1="0" x2="13" y2="0" stroke="#f0e6d2" strokeWidth="2" />
        <line x1="-6" y1="-4" x2="-6" y2="4" stroke="#f0e6d2" strokeWidth="1.5" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#f0e6d2" strokeWidth="1.5" />
        <line x1="6" y1="-4" x2="6" y2="4" stroke="#f0e6d2" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function DialProgress({ percent = 0, size = 64 }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke={TOKENS.navyLine} strokeWidth="4" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke={TOKENS.gold} strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: TOKENS.gold,
      }}>
        {percent}%
      </div>
    </div>
  );
}

function JokeBanner() {
  const pool = [
    ...JOKES.map((text) => ({ type: "joke", text })),
    ...QUOTES.map((q) => ({ type: "quote", text: q.text, author: q.author })),
  ];
  const [index, setIndex] = useState(() => Math.floor(Math.random() * pool.length));
  const item = pool[index];
  return (
    <div style={{
      background: "#fdf6e3", border: `1px solid #e8d9a8`, borderRadius: 6,
      padding: "10px 14px", marginBottom: 22, display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{item.type === "quote" ? "🎙️" : "🏈"}</span>
      <span style={{ flex: 1, fontSize: 13, color: "#7a5a12", lineHeight: 1.4 }}>
        {item.text}
        {item.type === "quote" && (
          <span style={{ fontWeight: 600 }}> — {item.author}</span>
        )}
      </span>
      <button
        onClick={() => setIndex((i) => { let n = i; while (n === i) n = Math.floor(Math.random() * pool.length); return n; })}
        aria-label="Another one"
        style={{
          flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 4,
          color: "#8a6a1f", display: "flex", alignItems: "center",
        }}
      >
        <RefreshCw size={13} />
      </button>
    </div>
  );
}

const EXAMPLE_FILMS = [
  {
    id: "cfl-spotlight",
    subjectLabel: "CFL Spotlight",
    title: "We Took a QB Lesson From a CFL Quarterback!",
    channel: "YouTube",
    videoId: "JeDHrGJAQIY",
  },
  {
    id: "defense",
    subjectLabel: "Defensive Concepts",
    title: "How Quarterbacks Read Defenses Post-Snap",
    channel: "Film Don't Lie University",
    videoId: "xu1DlqsSXfE",
  },
  {
    id: "offense",
    subjectLabel: "Offensive Concepts",
    title: "The Most Common Football Passing Concepts",
    channel: "YouTube",
    videoId: "pYBV8AylHEo",
  },
  {
    id: "presnap",
    subjectLabel: "Pre-Snap Reads",
    title: "What Is a Pre-Snap Read for Quarterbacks?",
    channel: "The Football Xpert",
    videoId: "T09sWj6wpwU",
  },
  {
    id: "mechanics",
    subjectLabel: "QB Mechanics",
    title: "QBMotion — Rob Williams",
    channel: "QB movement kinesiologist, works with CFL/NFL/NCAA QBs",
    channelUrl: "https://youtube.com/@QBMotion",
  },
  {
    id: "drillsfootwork",
    subjectLabel: "Drills & Footwork",
    title: "8 New QB Footwork Drills",
    channel: "YouTube",
    videoId: "JLzVt2gR2wQ",
  },
  {
    id: "running",
    subjectLabel: "The Running Game",
    title: "Zone Run Scheme | Football 101",
    channel: "YouTube",
    videoId: "lJpnYGf4ybs",
  },
  {
    id: "positions",
    subjectLabel: "Positions on the Field",
    title: "Every Position in American Football Explained",
    channel: "YouTube",
    videoId: "kfoYKISSf-M",
  },
  {
    id: "glossary",
    subjectLabel: "Glossary & Rules",
    title: "Canadian Football Rules Explained! (For Americans!)",
    channel: "Canadian Football Central",
    videoId: "nHKO8rV1ugg",
  },
  {
    id: "filmstudy",
    subjectLabel: "Film Study & Opponent Prep",
    title: "How To Watch Film Like a 5 Star QB",
    channel: "YouTube",
    videoId: "TgY9YvOtsHY",
  },
  {
    id: "leadership",
    subjectLabel: "Leadership",
    title: "Managing the Huddle: with Peyton Manning",
    channel: "YouTube",
    videoId: "uPDHKO2i2uU",
  },
  {
    id: "mentalgame",
    subjectLabel: "Mental Game & Confidence",
    title: "Do You Know How Quarterbacks Create the Matrix Mentality?",
    channel: "Elite Athletes TV",
    videoId: "1zeh82z2DzQ",
  },
  {
    id: "clocksituational",
    subjectLabel: "Clock & Situational Management",
    title: "Clock Management Mistakes Under Two Minutes in High School Football!",
    channel: "YouTube",
    videoId: "iM3G5c0xJk8",
  },
  {
    id: "armcare",
    subjectLabel: "Arm Care & Recovery",
    title: "Quarterback Shoulder and Arm Care Warm Up",
    channel: "Coach Bill Renner",
    videoId: "tWvomGkULFA",
  },
  {
    id: "nextlevel",
    subjectLabel: "Path to the Next Level",
    title: "College Coach Breakdown: How to Edit Your Football Highlight Reel the Right Way",
    channel: "Phase 1 Sports & Recruiting",
    videoId: "DRBESYlLtJw",
  },
];

const PROFILE_QUESTIONS = [
  { id: "name", label: "What's your name?", type: "short", placeholder: "e.g. Jordan Reyes" },
  { id: "level", label: "What level or team do you play at?", type: "short", placeholder: "e.g. 13U Peel Panthers, pivot" },
  { id: "favQB", label: "Who's your favourite QB, and why?", type: "long", placeholder: "Name a QB and what you admire about their game..." },
  { id: "whyQB", label: "Why do you want to be a QB?", type: "long", placeholder: "What drew you to the position?" },
  { id: "workingOn", label: "What's one thing you're working on right now?", type: "long", placeholder: "A read, a mechanic, a drill..." },
];

const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", badge: "IG", placeholder: "@yourhandle", urlPrefix: "https://instagram.com/" },
  { id: "twitter", label: "X / Twitter", badge: "X", placeholder: "@yourhandle", urlPrefix: "https://x.com/" },
  { id: "tiktok", label: "TikTok", badge: "TT", placeholder: "@yourhandle", urlPrefix: "https://www.tiktok.com/@" },
  { id: "hudl", label: "Hudl highlight reel", badge: "HU", placeholder: "https://hudl.com/profile/...", urlPrefix: "" },
];

function socialUrl(link, value) {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("http")) return trimmed;
  if (!link.urlPrefix) return `https://${trimmed}`;
  return link.urlPrefix + trimmed.replace(/^@/, "");
}


const QUIZ_QUESTIONS = [
  { id: "q1", subjectId: "glossary", prompt: "How many downs does a CFL offense get to gain 10 yards?", options: ["2", "3", "4", "5"], correctIndex: 1 },
  { id: "q2", subjectId: "glossary", prompt: "How many players are on the field per side in Canadian football?", options: ["9", "10", "11", "12"], correctIndex: 3 },
  { id: "q3", subjectId: "glossary", prompt: "How many points is a single (rouge) worth?", options: ["0", "1", "2", "3"], correctIndex: 1 },
  { id: "q4", subjectId: "offense", prompt: "How wide is a CFL football field, compared to the NFL's 53.3 yards?", options: ["55 yards", "60 yards", "65 yards", "70 yards"], correctIndex: 2 },
  { id: "q5", subjectId: "offense", prompt: "How deep are CFL end zones?", options: ["10 yards", "15 yards", "20 yards", "25 yards"], correctIndex: 2 },
  { id: "q6", subjectId: "presnap", prompt: "In the CFL, how far off the line of scrimmage must a defensive back line up before the snap?", options: ["0 yards", "1 yard", "3 yards", "5 yards"], correctIndex: 1 },
  { id: "q7", subjectId: "presnap", prompt: "What is a QB mainly trying to identify with a pre-snap read?", options: ["The referee's position", "Coverage and blitz look", "The play clock", "The wind direction"], correctIndex: 1 },
  { id: "q8", subjectId: "defense", prompt: "In man coverage, a defender is primarily responsible for covering...", options: ["A zone of the field", "A specific receiver", "The line of scrimmage", "The sideline"], correctIndex: 1 },
  { id: "q9", subjectId: "defense", prompt: "A \"zero\" blitz generally means the defense is playing...", options: ["Two deep safeties, zone under", "All-out man coverage with no deep safety help", "A soft zone with no blitz", "Prevent defense"], correctIndex: 1 },
  { id: "q10", subjectId: "mechanics", prompt: "Most of the power in a QB's throw comes from...", options: ["The wrist snap alone", "Hip and shoulder rotation", "Arm strength alone", "The grip"], correctIndex: 1 },
  { id: "q11", subjectId: "mechanics", prompt: "What should a QB's front foot generally do when throwing accurately?", options: ["Land open toward the sideline", "Land pointed at the target", "Stay off the ground", "Land behind the back foot"], correctIndex: 1 },
  { id: "q12", subjectId: "drillsfootwork", prompt: "A 3-step drop is typically paired with which kind of pass?", options: ["Deep shots downfield", "Quick, short-timing routes", "Handoffs", "Punts"], correctIndex: 1 },
  { id: "q13", subjectId: "drillsfootwork", prompt: "Ladder drills are mainly used to build...", options: ["Arm strength", "Quick, controlled footwork", "Grip strength", "Play-calling speed"], correctIndex: 1 },
  { id: "q14", subjectId: "running", prompt: "In inside zone blocking, the running back's initial aiming point is generally near...", options: ["The sideline", "The original guard alignment", "The quarterback", "The end zone"], correctIndex: 1 },
  { id: "q15", subjectId: "running", prompt: "What does play-action off the run game try to do?", options: ["Confuse the offensive line", "Get linebackers to bite on the run fake", "Slow down the QB", "Draw a penalty"], correctIndex: 1 },
  { id: "q16", subjectId: "positions", prompt: "Who is primarily responsible for pass protection up front?", options: ["The offensive line", "The safeties", "The kicker", "The slotbacks"], correctIndex: 0 },
  { id: "q17", subjectId: "positions", prompt: "Which position typically lines up deepest on defense?", options: ["Cornerback", "Defensive tackle", "Safety", "Linebacker"], correctIndex: 2 },
  { id: "q18", subjectId: "leadership", prompt: "What's a key habit for a QB commanding the huddle?", options: ["Speaking quickly and quietly", "Clear, confident communication", "Letting the center call the play", "Avoiding eye contact"], correctIndex: 1 },
  { id: "q19", subjectId: "leadership", prompt: "After throwing an interception, the strongest leadership response is to...", options: ["Argue with the referee", "Stay composed and refocus the offense", "Blame a teammate", "Ask to come out of the game"], correctIndex: 1 },
  { id: "q20", subjectId: "glossary", prompt: "What's a \"neutral zone\" in football?", options: ["The space between the two benches", "The space between the ball and each team's line before the snap", "The end zone", "The sideline area"], correctIndex: 1 },
  { id: "q21", subjectId: "filmstudy", prompt: "A good scouting report is best built around...", options: ["Every single play the defense has ever run", "The defense's top 2-3 coverages and blitzes", "Only what happened in the first quarter", "Guesses instead of film"], correctIndex: 1 },
  { id: "q22", subjectId: "filmstudy", prompt: "Why watch film in short, regular sessions instead of one long cram?", options: ["It looks better to coaches", "Short, consistent sessions build retention better than cramming", "It uses less data", "There's no real difference"], correctIndex: 1 },
  { id: "q23", subjectId: "mentalgame", prompt: "What's the best way to build real confidence as a QB?", options: ["Hyping yourself up before every game", "Reps, preparation, and film study", "Ignoring mistakes completely", "Avoiding pressure situations"], correctIndex: 1 },
  { id: "q24", subjectId: "clocksituational", prompt: "In the CFL, what happens if a punt or missed field goal lands in the end zone and isn't returned out?", options: ["Nothing, the play is dead", "The kicking team gets 1 point (a single/rouge)", "The receiving team gets 3 points", "The play is replayed"], correctIndex: 1 },
  { id: "q25", subjectId: "armcare", prompt: "What should you do if you notice sharp or worsening arm pain (not just normal soreness)?", options: ["Push through it, it'll go away", "Tell a coach or parent about it", "Throw more to loosen it up", "Ignore it until next season" ], correctIndex: 1 },
  { id: "q26", subjectId: "nextlevel", prompt: "What's generally considered the standard platform for sharing recruiting film in Canadian and U.S. football?", options: ["Instagram", "Hudl", "A personal website only", "Email attachments"], correctIndex: 1 },
];

function Cover3Diagram({ variant }) {
  // variant: "cut" (CBs low/outside underneath, halfbacks deep) or "hold" (CBs deep, halfbacks underneath)
  const deepIsCB = variant === "hold";
  const cbY = deepIsCB ? 46 : 142;
  const hbY = deepIsCB ? 142 : 46;
  const cbLabel = deepIsCB ? "CB (deep)" : "CB (low)";
  const hbLabel = deepIsCB ? "HB (low)" : "HB (deep)";
  const bobClass = `bob-${variant}`;

  return (
    <div style={{ background: TOKENS.navyDeep, borderRadius: 6, padding: "14px 10px 10px", marginBottom: 14 }}>
      <style>{`
        @keyframes ${bobClass} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .${bobClass} { animation: ${bobClass} 2.2s ease-in-out infinite; }
      `}</style>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, color: TOKENS.gold,
        textAlign: "center", textTransform: "uppercase", marginBottom: 8,
      }}>
        Cover 3 — {variant === "cut" ? "Cut" : "Hold"}
      </div>
      <svg width="100%" viewBox="0 0 400 230" role="img" aria-label={`Cover 3 ${variant} alignment diagram`}>
        {/* Deep third zone shading */}
        <rect x="0" y="15" width="133" height="90" fill={TOKENS.gold} opacity="0.08" />
        <rect x="133" y="15" width="134" height="90" fill={TOKENS.gold} opacity="0.14" />
        <rect x="267" y="15" width="133" height="90" fill={TOKENS.gold} opacity="0.08" />
        <line x1="133" y1="15" x2="133" y2="105" stroke={TOKENS.gold} strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />
        <line x1="267" y1="15" x2="267" y2="105" stroke={TOKENS.gold} strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />
        {/* Underneath zone shading */}
        <rect x="0" y="105" width="400" height="95" fill="#e8dcc4" opacity="0.06" />
        {/* Line of scrimmage */}
        <line x1="0" y1="205" x2="400" y2="205" stroke="#e8dcc4" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        <text x="200" y="218" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill="#e8dcc4" opacity="0.6">LINE OF SCRIMMAGE</text>

        {/* Offensive alignment */}
        {[{ x: 30, l: "X" }, { x: 115, l: "H" }, { x: 200, l: "F" }, { x: 285, l: "Y" }, { x: 370, l: "Z" }].map((o) => (
          <g key={o.l}>
            <circle cx={o.x} cy="200" r="6" fill={TOKENS.cream} stroke={TOKENS.navyLine} strokeWidth="1" />
            <text x={o.x} y="203" textAnchor="middle" fontSize="7" fontWeight="700" fill={TOKENS.navyDeep}>{o.l}</text>
          </g>
        ))}

        {/* Defensive line */}
        {[160, 185, 215, 240].map((x, i) => (
          <circle key={i} cx={x} cy="188" r="5" fill="#8a5730" opacity="0.85" />
        ))}
        <text x="200" y="182" textAnchor="middle" fontSize="7" fill={TOKENS.creamLine} opacity="0.7">DL</text>

        {/* Linebackers */}
        <circle cx="160" cy="150" r="6" fill={TOKENS.gold} opacity="0.9" />
        <circle cx="240" cy="150" r="6" fill={TOKENS.gold} opacity="0.9" />
        <text x="200" y="145" textAnchor="middle" fontSize="7" fill={TOKENS.creamLine} opacity="0.7">LB</text>

        {/* Free safety - always deep middle */}
        <g className={bobClass}>
          <circle cx="200" cy="45" r="8" fill={TOKENS.red} stroke="#fff" strokeWidth="1.5" />
          <text x="200" y="48" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">FS</text>
        </g>
        <text x="200" y="28" textAnchor="middle" fontSize="8" fill={TOKENS.cream}>FS (deep middle)</text>

        {/* Left corner + halfback */}
        <g className={bobClass}>
          <circle cx="60" cy={cbY} r="8" fill="#3b6ea5" stroke="#fff" strokeWidth="1.5" />
          <text x="60" y={cbY + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">CB</text>
        </g>
        <text x="60" y={cbY + (deepIsCB ? -15 : 22)} textAnchor="middle" fontSize="8" fill={TOKENS.cream}>{cbLabel}</text>

        <g className={bobClass}>
          <circle cx="115" cy={hbY} r="8" fill="#6b9c7a" stroke="#fff" strokeWidth="1.5" />
          <text x="115" y={hbY + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">HB</text>
        </g>
        <text x="115" y={hbY + (deepIsCB ? 22 : -15)} textAnchor="middle" fontSize="8" fill={TOKENS.cream}>{hbLabel}</text>

        {/* Right corner + halfback */}
        <g className={bobClass}>
          <circle cx="340" cy={cbY} r="8" fill="#3b6ea5" stroke="#fff" strokeWidth="1.5" />
          <text x="340" y={cbY + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">CB</text>
        </g>
        <text x="340" y={cbY + (deepIsCB ? -15 : 22)} textAnchor="middle" fontSize="8" fill={TOKENS.cream}>{cbLabel}</text>

        <g className={bobClass}>
          <circle cx="285" cy={hbY} r="8" fill="#6b9c7a" stroke="#fff" strokeWidth="1.5" />
          <text x="285" y={hbY + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">HB</text>
        </g>
        <text x="285" y={hbY + (deepIsCB ? 22 : -15)} textAnchor="middle" fontSize="8" fill={TOKENS.cream}>{hbLabel}</text>
      </svg>
      <div style={{ fontSize: 10.5, color: TOKENS.creamLine, textAlign: "center", marginTop: 4, fontStyle: "italic" }}>
        Gold bands = deep thirds &middot; dots gently settle into their zone
      </div>
    </div>
  );
}

function routePathD(x, type) {
  const y0 = 195;
  const isRight = x > 200;
  switch (type) {
    case "go": return `M ${x} ${y0} L ${x} 25`;
    case "seam": return `M ${x} ${y0} L ${x} 25`;
    case "corner": return `M ${x} ${y0} L ${x} 95 L ${isRight ? x + 65 : x - 65} 40`;
    case "post": return `M ${x} ${y0} L ${x} 95 L 200 40`;
    case "dig": return `M ${x} ${y0} L ${x} 130 L 200 130`;
    case "out": return `M ${x} ${y0} L ${x} 150 L ${isRight ? 392 : 8} 150`;
    case "outShort": return `M ${x} ${y0} L ${x} 168 L ${isRight ? 392 : 8} 168`;
    case "flat": return `M ${x} ${y0} L ${isRight ? 385 : 15} 186`;
    case "slant": return `M ${x} ${y0} L ${isRight ? x - 48 : x + 48} 150`;
    case "hitch": return `M ${x} ${y0} L ${x} 158`;
    case "crossShallow": return `M ${x} ${y0} L ${isRight ? 45 : 355} 178`;
    case "crossDeep": return `M ${x} ${y0} L ${isRight ? 45 : 355} 88`;
    case "checkrelease": return `M ${x} ${y0} Q ${x + (isRight ? -28 : 28)} 190, ${x + (isRight ? -50 : 50)} 178`;
    default: return `M ${x} ${y0} L ${x} 100`;
  }
}

function PositionsMapDiagram() {
  const groups = [
    // Offensive line
    { x: 150, y: 200, label: "T", color: "#8a5730" }, { x: 175, y: 200, label: "G", color: "#8a5730" },
    { x: 200, y: 200, label: "C", color: "#8a5730" }, { x: 225, y: 200, label: "G", color: "#8a5730" },
    { x: 250, y: 200, label: "T", color: "#8a5730" },
    // Skill positions
    { x: 200, y: 216, label: "QB", color: "#b23a2c" }, { x: 232, y: 220, label: "RB", color: "#b23a2c" },
    { x: 30, y: 195, label: "WR", color: "#b23a2c" }, { x: 370, y: 195, label: "WR", color: "#b23a2c" },
    { x: 90, y: 195, label: "SB", color: "#b23a2c" }, { x: 310, y: 195, label: "SB", color: "#b23a2c" },
    // Defensive front & linebackers
    { x: 155, y: 158, label: "DL", color: "#6b5030" }, { x: 180, y: 155, label: "DL", color: "#6b5030" },
    { x: 220, y: 155, label: "DL", color: "#6b5030" }, { x: 245, y: 158, label: "DL", color: "#6b5030" },
    { x: 150, y: 128, label: "LB", color: "#c8a24a" }, { x: 200, y: 122, label: "LB", color: "#c8a24a" },
    { x: 250, y: 128, label: "LB", color: "#c8a24a" },
    // Secondary
    { x: 60, y: 92, label: "CB", color: "#3b6ea5" }, { x: 340, y: 92, label: "CB", color: "#3b6ea5" },
    { x: 115, y: 65, label: "HB", color: "#6b9c7a" }, { x: 285, y: 65, label: "HB", color: "#6b9c7a" },
    { x: 200, y: 40, label: "S", color: "#b23a2c" },
  ];
  return (
    <div style={{ background: TOKENS.navyDeep, borderRadius: 6, padding: "14px 10px 10px", marginBottom: 12 }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, color: TOKENS.gold,
        textAlign: "center", textTransform: "uppercase", marginBottom: 8,
      }}>
        Full Field Positions Map — 12 a Side
      </div>
      <svg width="100%" viewBox="0 0 400 230" role="img" aria-label="Full field positions map for both offense and defense">
        <line x1="0" y1="175" x2="400" y2="175" stroke="#e8dcc4" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        <text x="200" y="188" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="7.5" fill="#e8dcc4" opacity="0.6">LINE OF SCRIMMAGE</text>
        {groups.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="8.5" fill={p.color} stroke="#fff" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">{p.label}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center", marginTop: 10, fontSize: 10.5, color: TOKENS.creamLine }}>
        <span><span style={{ color: "#8a5730" }}>●</span> O-Line</span>
        <span><span style={{ color: "#b23a2c" }}>●</span> Skill / Safety</span>
        <span><span style={{ color: "#6b5030" }}>●</span> D-Line</span>
        <span><span style={{ color: "#c8a24a" }}>●</span> Linebackers</span>
        <span><span style={{ color: "#3b6ea5" }}>●</span> Corners</span>
        <span><span style={{ color: "#6b9c7a" }}>●</span> Halfbacks</span>
      </div>
    </div>
  );
}

function FormationDiagram({ title, positions }) {
  return (
    <div style={{ background: TOKENS.navyDeep, borderRadius: 6, padding: "14px 10px 10px", marginBottom: 12 }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, color: TOKENS.gold,
        textAlign: "center", textTransform: "uppercase", marginBottom: 8,
      }}>
        {title}
      </div>
      <svg width="100%" viewBox="0 0 400 200" role="img" aria-label={`${title} formation diagram`}>
        <line x1="0" y1="175" x2="400" y2="175" stroke="#e8dcc4" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        <text x="200" y="190" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill="#e8dcc4" opacity="0.6">LINE OF SCRIMMAGE</text>
        {positions.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="9" fill={p.color || TOKENS.navyMid} stroke={TOKENS.gold} strokeWidth="1.5" />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={p.color ? "#fff" : TOKENS.gold}>{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MeshPointDiagram() {
  return (
    <div style={{ background: TOKENS.navyDeep, borderRadius: 6, padding: "14px 10px 10px", marginBottom: 12 }}>
      <style>{`
        @keyframes meshPulse { 0%, 100% { r: 10; opacity: 0.9; } 50% { r: 13; opacity: 0.5; } }
        .meshPulseRing { animation: meshPulse 1.6s ease-in-out infinite; }
      `}</style>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, color: TOKENS.gold,
        textAlign: "center", textTransform: "uppercase", marginBottom: 8,
      }}>
        The Mesh Point
      </div>
      <svg width="100%" viewBox="0 0 400 230" role="img" aria-label="Diagram of the QB and running back mesh point, with the read defender">
        <line x1="0" y1="205" x2="400" y2="205" stroke="#e8dcc4" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        <text x="200" y="218" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill="#e8dcc4" opacity="0.6">LINE OF SCRIMMAGE</text>

        {/* Read line from QB to the defender being read */}
        <line x1="205" y1="192" x2="295" y2="150" stroke={TOKENS.gold} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.75" />
        <text x="270" y="140" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill={TOKENS.gold}>READ</text>

        {/* RB path curving into the mesh point */}
        <path d="M 250 218 Q 220 200 206 195" fill="none" stroke="#e8dcc4" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

        {/* Read defender (edge) */}
        <circle cx="295" cy="150" r="8" fill="#6b5030" stroke="#fff" strokeWidth="1.2" />
        <text x="295" y="153" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">DE</text>

        {/* Mesh point marker */}
        <circle cx="205" cy="195" r="10" fill="none" stroke={TOKENS.gold} strokeWidth="2" className="meshPulseRing" />
        <circle cx="205" cy="195" r="4" fill={TOKENS.gold} />

        {/* QB */}
        <circle cx="200" cy="192" r="8" fill="#b23a2c" stroke="#fff" strokeWidth="1.2" />
        <text x="200" y="195" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">QB</text>

        {/* RB */}
        <circle cx="250" cy="218" r="8" fill="#b23a2c" stroke="#fff" strokeWidth="1.2" />
        <text x="250" y="221" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">RB</text>

        <text x="205" y="180" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill={TOKENS.gold}>MESH</text>
      </svg>
    </div>
  );
}

function RunPlayDiagram({ title, blockers, pullers = [], backPath }) {
  const safeId = title.replace(/[^a-zA-Z0-9]/g, "");
  const flowClass = `flow-${safeId}`;
  return (
    <div style={{ background: TOKENS.navyDeep, borderRadius: 6, padding: "14px 10px 10px", marginBottom: 14 }}>
      <style>{`
        @keyframes ${flowClass} { to { stroke-dashoffset: -20; } }
        .${flowClass} { stroke-dasharray: 6 5; animation: ${flowClass} 1.1s linear infinite; }
      `}</style>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, color: TOKENS.gold,
        textAlign: "center", textTransform: "uppercase", marginBottom: 8,
      }}>
        {title}
      </div>
      <svg width="100%" viewBox="0 0 400 230" role="img" aria-label={`${title} blocking diagram`}>
        <defs>
          <marker id={`barrow-${safeId}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#8a5730" />
          </marker>
          <marker id={`parrow-${safeId}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill={TOKENS.gold} />
          </marker>
          <marker id={`rbarrow-${safeId}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#e8dcc4" />
          </marker>
        </defs>
        {/* Line of scrimmage */}
        <line x1="0" y1="205" x2="400" y2="205" stroke="#e8dcc4" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        <text x="200" y="218" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill="#e8dcc4" opacity="0.6">LINE OF SCRIMMAGE</text>

        {/* Ball carrier path, drawn first so OL dots sit on top */}
        <path d={backPath} fill="none" stroke="#e8dcc4" strokeWidth="2.5" strokeLinecap="round" markerEnd={`url(#rbarrow-${safeId})`} className={flowClass} opacity="0.95" />

        {/* Puller arrows (longer, gold) */}
        {pullers.map((p, i) => (
          <line key={i} x1={p.x} y1={p.y} x2={p.toX} y2={p.toY} stroke={TOKENS.gold} strokeWidth="2.5" strokeLinecap="round" markerEnd={`url(#parrow-${safeId})`} />
        ))}

        {/* OL block-direction arrows */}
        {blockers.map((b, i) => (
          <line key={i} x1={b.x} y1={b.y} x2={b.toX} y2={b.toY} stroke="#8a5730" strokeWidth="2" strokeLinecap="round" markerEnd={`url(#barrow-${safeId})`} opacity="0.9" />
        ))}

        {/* OL position dots */}
        {blockers.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r="7" fill="#8a5730" stroke="#fff" strokeWidth="1.2" />
        ))}
        {pullers.map((p, i) => (
          <circle key={`pd${i}`} cx={p.x} cy={p.y} r="7" fill="#8a5730" stroke={TOKENS.gold} strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}

function RoutesDiagram({ title, routes }) {
  const safeId = title.replace(/[^a-zA-Z0-9]/g, "");
  const flowClass = `flow-${safeId}`;
  return (
    <div style={{ background: TOKENS.navyDeep, borderRadius: 6, padding: "14px 10px 10px", marginBottom: 14 }}>
      <style>{`
        @keyframes ${flowClass} { to { stroke-dashoffset: -20; } }
        .${flowClass} { stroke-dasharray: 6 5; animation: ${flowClass} 1.1s linear infinite; }
      `}</style>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, color: TOKENS.gold,
        textAlign: "center", textTransform: "uppercase", marginBottom: 8,
      }}>
        {title}
      </div>
      <svg width="100%" viewBox="0 0 400 230" role="img" aria-label={`${title} route diagram`}>
        <defs>
          <marker id={`arrow-${safeId}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill={TOKENS.gold} />
          </marker>
        </defs>
        {/* Line of scrimmage */}
        <line x1="0" y1="205" x2="400" y2="205" stroke="#e8dcc4" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        <text x="200" y="218" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill="#e8dcc4" opacity="0.6">LINE OF SCRIMMAGE</text>

        {/* Route paths, drawn first so receiver dots sit on top */}
        {routes.map((r, i) => (
          <path key={i} d={routePathD(r.x, r.type)} fill="none" stroke={TOKENS.gold} strokeWidth="2" strokeLinecap="round" markerEnd={`url(#arrow-${safeId})`} className={flowClass} opacity="0.9" />
        ))}

        {/* Receiver alignment dots */}
        {routes.map((r, i) => (
          <g key={i}>
            <circle cx={r.x} cy="200" r="7" fill={TOKENS.navyMid} stroke={TOKENS.gold} strokeWidth="1.5" />
            <text x={r.x} y="203" textAnchor="middle" fontSize="8" fontWeight="700" fill={TOKENS.gold}>{r.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function DefenseFieldDiagram({ title, zoneMode = "none", markers = [], dl = [160, 185, 215, 240], lb = [160, 240], shift = null }) {
  const safeId = title.replace(/[^a-zA-Z0-9]/g, "");
  const bobClass = `bob-${safeId}`;
  return (
    <div style={{ background: TOKENS.navyDeep, borderRadius: 6, padding: "14px 10px 10px", marginBottom: 14 }}>
      <style>{`
        @keyframes ${bobClass} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .${bobClass} { animation: ${bobClass} 2.2s ease-in-out infinite; }
      `}</style>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, color: TOKENS.gold,
        textAlign: "center", textTransform: "uppercase", marginBottom: 8,
      }}>
        {title}
      </div>
      <svg width="100%" viewBox="0 0 400 230" role="img" aria-label={`${title} alignment diagram`}>
        {zoneMode === "thirds" && (
          <>
            <rect x="0" y="15" width="133" height="90" fill={TOKENS.gold} opacity="0.08" />
            <rect x="133" y="15" width="134" height="90" fill={TOKENS.gold} opacity="0.14" />
            <rect x="267" y="15" width="133" height="90" fill={TOKENS.gold} opacity="0.08" />
            <line x1="133" y1="15" x2="133" y2="105" stroke={TOKENS.gold} strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />
            <line x1="267" y1="15" x2="267" y2="105" stroke={TOKENS.gold} strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />
          </>
        )}
        {zoneMode === "halves" && (
          <>
            <rect x="0" y="15" width="200" height="90" fill={TOKENS.gold} opacity="0.10" />
            <rect x="200" y="15" width="200" height="90" fill={TOKENS.gold} opacity="0.10" />
            <line x1="200" y1="15" x2="200" y2="105" stroke={TOKENS.gold} strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />
          </>
        )}
        {zoneMode !== "none" && <rect x="0" y="105" width="400" height="95" fill="#e8dcc4" opacity="0.06" />}
        {shift && (
          <rect
            x={shift.side === "left" ? 100 : 200} y="160" width="100" height="45"
            fill={TOKENS.gold} opacity="0.15"
          />
        )}

        {/* Line of scrimmage */}
        <line x1="0" y1="205" x2="400" y2="205" stroke="#e8dcc4" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        <text x="200" y="218" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fill="#e8dcc4" opacity="0.6">LINE OF SCRIMMAGE</text>

        {/* Offensive alignment */}
        {[{ x: 30, l: "X" }, { x: 115, l: "H" }, { x: 200, l: "F" }, { x: 285, l: "Y" }, { x: 370, l: "Z" }].map((o) => (
          <g key={o.l}>
            <circle cx={o.x} cy="200" r="6" fill={TOKENS.cream} stroke={TOKENS.navyLine} strokeWidth="1" />
            <text x={o.x} y="203" textAnchor="middle" fontSize="7" fontWeight="700" fill={TOKENS.navyDeep}>{o.l}</text>
          </g>
        ))}

        {/* Defensive line */}
        {dl.map((x, i) => (
          <circle key={i} cx={x} cy="188" r="5" fill="#8a5730" opacity="0.85" />
        ))}
        <text x="200" y={shift ? 176 : 182} textAnchor="middle" fontSize="7" fill={TOKENS.creamLine} opacity="0.7">DL</text>

        {/* Linebackers */}
        {lb.map((x, i) => (
          <circle key={i} cx={x} cy="150" r="6" fill={TOKENS.gold} opacity="0.9" />
        ))}

        {/* Custom markers (safeties, corners, halfbacks, nickel/dime backs) */}
        {markers.map((m, i) => (
          <g key={i} className={m.bob ? bobClass : undefined}>
            <circle cx={m.x} cy={m.y} r="8" fill={m.color} stroke="#fff" strokeWidth="1.5" strokeDasharray={m.ghost ? "2 2" : undefined} opacity={m.ghost ? 0.4 : 1} />
            <text x={m.x} y={m.y + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" opacity={m.ghost ? 0.6 : 1}>{m.label}</text>
            {m.sub && (
              <text x={m.x} y={m.y + (m.subBelow ? 22 : -15)} textAnchor="middle" fontSize="8" fill={TOKENS.cream}>{m.sub}</text>
            )}
          </g>
        ))}
        {shift && (
          <>
            <text x={shift.side === "left" ? 150 : 250} y="172" textAnchor="middle" fontSize="7.5" fill={TOKENS.gold} fontWeight="700">STRENGTH SIDE</text>
            <text x={shift.side === "left" ? 250 : 150} y="172" textAnchor="middle" fontSize="7.5" fill={TOKENS.creamLine} opacity="0.7">MORE ROOM</text>
          </>
        )}
      </svg>
    </div>
  );
}

function ExampleFilmCard({ film }) {
  const isChannel = !film.videoId;
  return (
    <a
      href={isChannel ? film.channelUrl : `https://www.youtube.com/watch?v=${film.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block", background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6,
        overflow: "hidden", textDecoration: "none", color: TOKENS.ink,
      }}
    >
      <div style={{ position: "relative", background: TOKENS.navyMid, aspectRatio: "16/9" }}>
        {isChannel ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: TOKENS.navyDeep,
              border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Play size={16} color={TOKENS.gold} fill={TOKENS.gold} />
            </div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
              color: TOKENS.gold, textTransform: "uppercase", textAlign: "center",
            }}>
              Visit Channel
            </div>
          </div>
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${film.videoId}/hqdefault.jpg`}
              alt={film.title}
              style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", opacity: 0.92 }}
            />
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "rgba(15,29,51,0.75)",
                border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Play size={16} color={TOKENS.gold} fill={TOKENS.gold} />
              </div>
            </div>
          </>
        )}
        <div style={{
          position: "absolute", top: 8, left: 8, background: TOKENS.navyDeep, color: TOKENS.gold,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 0.5, padding: "3px 7px",
          borderRadius: 3, textTransform: "uppercase",
        }}>
          {film.subjectLabel}
        </div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{film.title}</div>
        <div style={{ fontSize: 11.5, color: TOKENS.inkSoft }}>{film.channel} &middot; YouTube</div>
      </div>
    </a>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [drillReps, setDrillReps] = useState({});
  const [filmLog, setFilmLog] = useState([]);
  const [pendingClip, setPendingClip] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [clipQuestionDraft, setClipQuestionDraft] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionDraft, setQuestionDraft] = useState("");
  const [profile, setProfile] = useState({});
  const [profileDraft, setProfileDraft] = useState({});
  const [editingProfile, setEditingProfile] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [showCoachView, setShowCoachView] = useState(false);
  const [showQuestionsCoachView, setShowQuestionsCoachView] = useState(false);
  const [showFilmCoachView, setShowFilmCoachView] = useState(false);
  const [coachUnlocked, setCoachUnlocked] = useState(false);
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [pendingCoachAction, setPendingCoachAction] = useState(null);
  const [passcodeDraft, setPasscodeDraft] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [plan, setPlan] = useState({ seasonGoal: "", focusAreas: [] });
  const [goalDraft, setGoalDraft] = useState("");
  const [editingGoal, setEditingGoal] = useState(true);
  const [weekFocus, setWeekFocus] = useState([]);
  const [weekFocusDraft, setWeekFocusDraft] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [milestoneDraft, setMilestoneDraft] = useState("");
  const [milestoneDateDraft, setMilestoneDateDraft] = useState("");
  const [reflections, setReflections] = useState([]);
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackNameDraft, setFeedbackNameDraft] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("qbv360-progress", false);
        if (p) setProgress(JSON.parse(p.value));
      } catch (e) {}
      try {
        const d = await window.storage.get("qbv360-drills", false);
        if (d) setDrillReps(JSON.parse(d.value));
      } catch (e) {}
      try {
        const f = await window.storage.get("qbv360-filmroom", true);
        if (f) setFilmLog(JSON.parse(f.value));
      } catch (e) {}
      try {
        const q = await window.storage.get("qbv360-questions", true);
        if (q) setQuestions(JSON.parse(q.value));
      } catch (e) {}
      try {
        const p = await window.storage.get("qbv360-profile", false);
        if (p) {
          const parsed = JSON.parse(p.value);
          setProfile(parsed);
          setProfileDraft(parsed);
          if (Object.values(parsed).some((v) => v && v.trim())) setEditingProfile(false);
        }
      } catch (e) {}
      try {
        const r = await window.storage.get("qbv360-quiz-results", true);
        if (r) setQuizResults(JSON.parse(r.value));
      } catch (e) {}
      try {
        const fb = await window.storage.get("qbv360-feedback", true);
        if (fb) setFeedbackList(JSON.parse(fb.value));
      } catch (e) {}
      try {
        const pl = await window.storage.get("qbv360-plan", false);
        if (pl) {
          const parsed = JSON.parse(pl.value);
          setPlan(parsed);
          setGoalDraft(parsed.seasonGoal || "");
          if (parsed.seasonGoal && parsed.seasonGoal.trim()) setEditingGoal(false);
        }
      } catch (e) {}
      try {
        const wf = await window.storage.get("qbv360-week-focus", false);
        if (wf) setWeekFocus(JSON.parse(wf.value));
      } catch (e) {}
      try {
        const ms = await window.storage.get("qbv360-milestones", false);
        if (ms) setMilestones(JSON.parse(ms.value));
      } catch (e) {}
      try {
        const rf = await window.storage.get("qbv360-reflections", false);
        if (rf) setReflections(JSON.parse(rf.value));
      } catch (e) {}
      try {
        const ob = await window.storage.get("qbv360-onboarded", false);
        if (!ob) setShowWalkthrough(true);
      } catch (e) {
        setShowWalkthrough(true);
      }
      setLoaded(true);
    })();
  }, []);

  async function persist(key, value, setter, shared = false) {
    setter(value);
    try {
      await window.storage.set(key, JSON.stringify(value), shared);
    } catch (e) {
      console.error("Storage error", e);
    }
  }

  function toggleLesson(subjectId, idx) {
    const subj = progress[subjectId] || {};
    const next = { ...progress, [subjectId]: { ...subj, [idx]: !subj[idx] } };
    persist("qbv360-progress", next, setProgress);
  }

  function subjectPercent(subject) {
    const done = progress[subject.id] || {};
    const count = subject.lessons.filter((_, i) => done[i]).length;
    return Math.round((count / subject.lessons.length) * 100);
  }

  function bumpDrill(drill, delta) {
    const current = drillReps[drill.id] || 0;
    const next = Math.max(0, Math.min(drill.target, current + delta));
    persist("qbv360-drills", { ...drillReps, [drill.id]: next }, setDrillReps);
  }

  function handleFilePicked(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingClip({ name: file.name, url });
    setNoteDraft("");
  }

  function saveClip() {
    if (!pendingClip) return;
    const entry = {
      id: `${Date.now()}`,
      name: pendingClip.name,
      date: new Date().toLocaleDateString(),
      notes: noteDraft.trim(),
      question: clipQuestionDraft.trim(),
      status: clipQuestionDraft.trim() ? "Pending" : null,
    };
    const next = [entry, ...filmLog];
    persist("qbv360-filmroom", next, setFilmLog, true);
    setPendingClip(null);
    setNoteDraft("");
    setClipQuestionDraft("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function submitQuestion() {
    const text = questionDraft.trim();
    if (!text) return;
    const entry = {
      id: `${Date.now()}`,
      text,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    };
    const next = [entry, ...questions];
    persist("qbv360-questions", next, setQuestions, true);
    setQuestionDraft("");
  }

  function saveProfile() {
    persist("qbv360-profile", profileDraft, setProfile);
    setEditingProfile(false);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz() {
    const picked = shuffle(QUIZ_QUESTIONS).slice(0, 8).map((q) => {
      const opts = q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex }));
      return { ...q, options: shuffle(opts) };
    });
    setQuizQuestions(picked);
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizSelected(null);
    setQuizStarted(true);
    setQuizFinished(false);
  }

  function selectAnswer(optIndex) {
    if (quizSelected !== null) return;
    setQuizSelected(optIndex);
    const correct = quizQuestions[quizIndex].options[optIndex].isCorrect;
    setQuizAnswers([...quizAnswers, correct]);
  }

  function nextQuestion() {
    if (quizIndex + 1 >= quizQuestions.length) {
      finishQuiz();
    } else {
      setQuizIndex(quizIndex + 1);
      setQuizSelected(null);
    }
  }

  function finishQuiz() {
    setQuizFinished(true);
    const scoreCount = quizAnswers.filter(Boolean).length;
    const entry = {
      id: `${Date.now()}`,
      name: (profile.name && profile.name.trim()) || "Anonymous",
      score: scoreCount,
      total: quizQuestions.length,
      date: new Date().toLocaleString(),
    };
    persist("qbv360-quiz-results", [entry, ...quizResults], setQuizResults, true);
  }

  function requestCoachView(which) {
    const isShowing = which === "quiz" ? showCoachView : which === "questions" ? showQuestionsCoachView : showFilmCoachView;
    if (coachUnlocked || isShowing) {
      if (which === "quiz") setShowCoachView(!showCoachView);
      else if (which === "questions") setShowQuestionsCoachView(!showQuestionsCoachView);
      else setShowFilmCoachView(!showFilmCoachView);
      return;
    }
    setPendingCoachAction(which);
    setPasscodeDraft("");
    setPasscodeError(false);
    setShowPasscodePrompt(true);
  }

  function finishWalkthrough() {
    setShowWalkthrough(false);
    setWalkthroughStep(0);
    persist("qbv360-onboarded", "true", () => {});
  }

  function nextWalkthroughStep() {
    if (walkthroughStep + 1 >= WALKTHROUGH_STEPS.length) {
      finishWalkthrough();
    } else {
      setWalkthroughStep(walkthroughStep + 1);
    }
  }

  function replayWalkthrough() {
    setWalkthroughStep(0);
    setShowWalkthrough(true);
  }

  function openCoachDashboard() {
    if (coachUnlocked) {
      setTab("coach");
      return;
    }
    setPendingCoachAction("dashboard");
    setPasscodeDraft("");
    setPasscodeError(false);
    setShowPasscodePrompt(true);
  }

  function submitPasscode() {
    if (passcodeDraft === COACH_PASSCODE) {
      setCoachUnlocked(true);
      setShowPasscodePrompt(false);
      if (pendingCoachAction === "quiz") setShowCoachView(true);
      else if (pendingCoachAction === "questions") setShowQuestionsCoachView(true);
      else if (pendingCoachAction === "film") setShowFilmCoachView(true);
      else if (pendingCoachAction === "dashboard") setTab("coach");
      setPendingCoachAction(null);
    } else {
      setPasscodeError(true);
    }
  }

  function saveGoal() {
    const next = { ...plan, seasonGoal: goalDraft.trim() };
    persist("qbv360-plan", next, setPlan);
    setEditingGoal(false);
  }

  function toggleFocusArea(subjectId) {
    const has = plan.focusAreas.includes(subjectId);
    let nextAreas;
    if (has) {
      nextAreas = plan.focusAreas.filter((id) => id !== subjectId);
    } else {
      if (plan.focusAreas.length >= 3) return;
      nextAreas = [...plan.focusAreas, subjectId];
    }
    persist("qbv360-plan", { ...plan, focusAreas: nextAreas }, setPlan);
  }

  function addWeekFocusItem() {
    const text = weekFocusDraft.trim();
    if (!text) return;
    const entry = { id: `${Date.now()}`, text, done: false };
    persist("qbv360-week-focus", [...weekFocus, entry], setWeekFocus);
    setWeekFocusDraft("");
  }

  function toggleWeekFocusItem(id) {
    const next = weekFocus.map((item) => item.id === id ? { ...item, done: !item.done } : item);
    persist("qbv360-week-focus", next, setWeekFocus);
  }

  function removeWeekFocusItem(id) {
    persist("qbv360-week-focus", weekFocus.filter((item) => item.id !== id), setWeekFocus);
  }

  function addMilestone() {
    const text = milestoneDraft.trim();
    if (!text) return;
    const entry = { id: `${Date.now()}`, text, date: milestoneDateDraft, done: false };
    const next = [...milestones, entry].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
    persist("qbv360-milestones", next, setMilestones);
    setMilestoneDraft("");
    setMilestoneDateDraft("");
  }

  function toggleMilestone(id) {
    const next = milestones.map((m) => m.id === id ? { ...m, done: !m.done } : m);
    persist("qbv360-milestones", next, setMilestones);
  }

  function removeMilestone(id) {
    persist("qbv360-milestones", milestones.filter((m) => m.id !== id), setMilestones);
  }

  function addReflection() {
    const text = reflectionDraft.trim();
    if (!text) return;
    const entry = { id: `${Date.now()}`, text, date: new Date().toLocaleDateString() };
    persist("qbv360-reflections", [entry, ...reflections], setReflections);
    setReflectionDraft("");
  }

  function submitFeedback() {
    const text = feedbackDraft.trim();
    if (!text) return;
    const entry = {
      id: `${Date.now()}`,
      name: feedbackNameDraft.trim() || "Anonymous",
      text,
      date: new Date().toLocaleDateString(),
    };
    persist("qbv360-feedback", [entry, ...feedbackList], setFeedbackList, true);
    setFeedbackNameDraft("");
    setFeedbackDraft("");
  }

  const navItems = [
    { id: "lessons", label: "Lessons" },
    { id: "drills", label: "Drills" },
    { id: "film", label: "Film Room" },
    { id: "quiz", label: "Quiz" },
    { id: "questions", label: "Ask Coach" },
    { id: "plan", label: "Build a Plan" },
    { id: "profile", label: "Build Your Profile" },
    { id: "achievements", label: "Achievements" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: TOKENS.cream, minHeight: "100%", color: TOKENS.ink }}>
      <style>{FONT_IMPORT}</style>

      {/* Header */}
      <header style={{ background: TOKENS.navyDeep, borderBottom: `3px solid ${TOKENS.gold}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <button
            onClick={() => { setTab("home"); setSelectedSubject(null); setExpandedLesson(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 14, background: "none", border: "none",
              cursor: "pointer", padding: 0, textAlign: "left", flexShrink: 0,
            }}
          >
            <CompassMark size={52} />
            <div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: 1,
                color: TOKENS.gold, lineHeight: 1.1,
              }}>
                QB VISION 360
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 2,
                color: TOKENS.creamLine, textTransform: "uppercase",
              }}>
                Precision starts with a vision
              </div>
            </div>
          </button>
          <button
            onClick={replayWalkthrough}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
              fontFamily: "'Oswald', sans-serif", fontSize: 13.5, fontWeight: 700, letterSpacing: 0.3,
              color: TOKENS.navyDeep, background: TOKENS.gold, border: "none", borderRadius: 18,
              padding: "10px 18px", cursor: "pointer",
            }}
          >
            <Play size={14} /> Take the Tour
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => { setTab("about"); setSelectedSubject(null); setExpandedLesson(null); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
              fontFamily: "'Oswald', sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: 0.3,
              color: TOKENS.gold, background: "transparent", border: `1px solid ${TOKENS.gold}`, borderRadius: 14,
              padding: "6px 12px", cursor: "pointer",
            }}
          >
            <Heart size={11} /> Parents/Coaches
          </button>
          <button
            onClick={openCoachDashboard}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
              fontFamily: "'Oswald', sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: 0.3,
              color: TOKENS.gold, background: "transparent", border: `1px solid ${TOKENS.gold}`, borderRadius: 14,
              padding: "6px 12px", cursor: "pointer",
            }}
          >
            <Trophy size={11} /> Coach Dashboard
          </button>
        </div>
        <nav style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", display: "flex", gap: 2, overflowX: "auto", whiteSpace: "nowrap" }}>
          {navItems.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSelectedSubject(null); setExpandedLesson(null); }}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 12.5, letterSpacing: 0.3, fontWeight: 600,
                  padding: "10px 12px", background: "transparent", border: "none", cursor: "pointer",
                  color: active ? TOKENS.gold : TOKENS.creamLine,
                  borderBottom: active ? `3px solid ${TOKENS.gold}` : "3px solid transparent",
                  marginBottom: -3, textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px" }}>
        <JokeBanner key={tab} />

        {tab === "home" && (() => {
          const totalLessons = SUBJECTS.reduce((sum, s) => sum + s.lessons.length, 0);
          const completedLessons = SUBJECTS.reduce((sum, s) => {
            const done = progress[s.id] || {};
            return sum + s.lessons.filter((_, i) => done[i]).length;
          }, 0);
          const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
          const hasProfile = profile.name && profile.name.trim();

          const quickLinks = [
            { id: "lessons", label: "Lessons", icon: BookOpen, desc: `${SUBJECTS.length} subjects to explore` },
            { id: "drills", label: "Drills", icon: Footprints, desc: "Log your reps" },
            { id: "quiz", label: "Quiz", icon: Brain, desc: "Test yourself" },
            { id: "plan", label: "Build a Plan", icon: Target, desc: "Set your goal" },
          ];

          return (
            <div>
              <div style={{
                background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`, borderRadius: 8,
                padding: "36px 24px", textAlign: "center", color: TOKENS.cream, marginBottom: 24,
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <CompassMark size={76} />
                </div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, color: TOKENS.gold, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
                  {hasProfile ? `Welcome back, ${profile.name.split(" ")[0]}` : "Welcome to QB Vision 360"}
                </div>
                <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 27, fontWeight: 700, margin: "0 0 12px" }}>
                  See the field. Read the game.
                </h1>
                <p style={{ fontSize: 14, color: TOKENS.creamLine, maxWidth: 520, margin: "0 auto 22px", lineHeight: 1.6 }}>
                  Mechanics and football IQ, side by side — built specifically for young quarterbacks learning the Canadian game.
                </p>
                <button
                  onClick={() => { if (hasProfile) { setTab("lessons"); } else { replayWalkthrough(); } }}
                  style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 0.5,
                    padding: "12px 28px", background: TOKENS.gold, color: TOKENS.navyDeep, border: "none",
                    borderRadius: 5, cursor: "pointer",
                  }}
                >
                  {hasProfile ? "Continue Training" : "Take the Tour"}
                </button>
              </div>

              {totalLessons > 0 && completedLessons > 0 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 16, background: "#fff",
                  border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: "16px 20px", marginBottom: 24,
                }}>
                  <DialProgress percent={overallPct} size={58} />
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600 }}>
                      Overall Progress
                    </div>
                    <div style={{ fontSize: 12.5, color: TOKENS.inkSoft }}>
                      {completedLessons} of {totalLessons} lessons complete across all subjects
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, color: TOKENS.inkSoft,
                textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12,
              }}>
                Jump In
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                {quickLinks.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.id}
                      onClick={() => { setTab(q.id); setSelectedSubject(null); setExpandedLesson(null); }}
                      style={{
                        textAlign: "left", background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`,
                        borderRadius: 6, padding: 16, cursor: "pointer", color: TOKENS.cream,
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%", background: TOKENS.navyDeep,
                        border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 10,
                      }}>
                        <Icon size={15} color={TOKENS.gold} />
                      </div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14.5, fontWeight: 600, marginBottom: 2 }}>
                        {q.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: TOKENS.creamLine }}>{q.desc}</div>
                    </button>
                  );
                })}
              </div>

              {!hasProfile && (
                <div style={{
                  marginTop: 20, fontSize: 12.5, color: TOKENS.inkSoft, textAlign: "center", fontStyle: "italic",
                }}>
                  Tip: filling out your profile helps us tailor content to your age and skill level.
                </div>
              )}

              <div style={{ background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`, borderRadius: 6, padding: 24, color: TOKENS.cream, marginTop: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%", background: TOKENS.navyDeep,
                    border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={20} color={TOKENS.gold} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 19, fontWeight: 700 }}>
                      Meet the Coach
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: TOKENS.creamLine, letterSpacing: 0.5, marginTop: 2 }}>
                      Dan Carnevale <span style={{ fontWeight: 400, opacity: 0.85 }}>a.k.a. Coach Deadpool</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14.5, lineHeight: 1.6 }}>
                  <p style={{ margin: 0 }}>
                    Born and raised in Mississauga, Ontario, I got into football late — not until grade 12 — but it stuck. I went on to play CIS football at Acadia University, and after that I kept playing overseas in Germany.
                  </p>
                  <p style={{ margin: 0 }}>
                    I started coaching three years ago, when my oldest son (born 2011) was in grade 7, and it didn't take long to notice a real gap in how young quarterbacks were being developed — not just in technique, but in actually understanding the game itself. There were plenty of QB camps and drill videos out there, but very few coaches were teaching the position <em>and</em> the game together.
                  </p>
                  <p style={{ margin: 0 }}>
                    Because I work in AI and technology, it seemed like a great chance to build this app myself.
                  </p>
                  <p style={{ margin: 0 }}>
                    QB Vision 360 came out of that gap — a place for young quarterbacks to build both the mechanics and the football IQ side by side, built specifically for the Canadian game.
                  </p>
                  <p style={{ margin: 0 }}>
                    Football has given me a lot, and I hope to give back.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {tab === "lessons" && selectedSubject === null && (
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4, color: TOKENS.ink }}>
              Lesson Library
            </h1>
            <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
              Fourteen subjects built for the Canadian game — three downs, 12 players, and a wider field.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {SUBJECTS.map((s) => {
                const Icon = s.icon;
                const pct = subjectPercent(s);
                return (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSubject(s.id); setExpandedLesson(null); }}
                    style={{
                      textAlign: "left", background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`,
                      borderRadius: 6, padding: 18, cursor: "pointer", color: TOKENS.cream,
                      display: "flex", flexDirection: "column", gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%", background: TOKENS.navyDeep,
                        border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={18} color={TOKENS.gold} />
                      </div>
                      <DialProgress percent={pct} size={52} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 3 }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: 12.5, color: TOKENS.creamLine, lineHeight: 1.4 }}>{s.blurb}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "lessons" && selectedSubject !== null && (() => {
          const subject = SUBJECTS.find((s) => s.id === selectedSubject);
          const Icon = subject.icon;
          const done = progress[subject.id] || {};
          return (
            <div>
              <button
                onClick={() => { setSelectedSubject(null); setExpandedLesson(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
                  cursor: "pointer", color: TOKENS.inkSoft, fontSize: 13, marginBottom: 18, padding: 0,
                }}
              >
                <ChevronLeft size={16} /> Back to lessons
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%", background: TOKENS.navyMid,
                  border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color={TOKENS.gold} />
                </div>
                <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 700 }}>{subject.title}</h1>
              </div>
              {subject.id === "positions" && <PositionsMapDiagram />}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {subject.lessons.map((lesson, idx) => {
                  const isDone = !!done[idx];
                  const hasDetail = typeof lesson === "object";
                  const title = hasDetail ? lesson.title : lesson;
                  const isExpanded = expandedLesson === idx;
                  return (
                    <div key={idx}>
                      <div
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          background: "#fff", border: `1px solid ${TOKENS.creamLine}`,
                          borderRadius: isExpanded ? "6px 6px 0 0" : 6,
                          padding: "14px 16px",
                        }}
                      >
                        <button
                          onClick={() => toggleLesson(subject.id, idx)}
                          aria-label="Mark lesson complete"
                          style={{
                            width: 22, height: 22, borderRadius: 4, flexShrink: 0, padding: 0,
                            border: `2px solid ${isDone ? TOKENS.gold : TOKENS.creamLine}`,
                            background: isDone ? TOKENS.gold : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                          }}
                        >
                          {isDone && <Check size={14} color={TOKENS.navyDeep} />}
                        </button>
                        <button
                          onClick={() => hasDetail ? setExpandedLesson(isExpanded ? null : idx) : toggleLesson(subject.id, idx)}
                          style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                            gap: 10, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer",
                          }}
                        >
                          <span style={{ fontSize: 14.5, color: isDone ? TOKENS.inkSoft : TOKENS.ink, textDecoration: isDone ? "line-through" : "none" }}>
                            {title}
                          </span>
                          {hasDetail && (
                            <ChevronLeft
                              size={15}
                              color={TOKENS.inkSoft}
                              style={{ flexShrink: 0, transform: isExpanded ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.15s" }}
                            />
                          )}
                        </button>
                      </div>
                      {hasDetail && isExpanded && (
                        <div style={{
                          background: TOKENS.cream, border: `1px solid ${TOKENS.creamLine}`, borderTop: "none",
                          borderRadius: "0 0 6px 6px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14,
                        }}>
                          {lesson.note && (
                            <div style={{
                              background: "#fdf6e3", border: `1px solid #e8d9a8`, borderRadius: 4,
                              padding: "10px 12px", fontSize: 12.5, color: "#7a5a12", lineHeight: 1.5, fontStyle: "italic",
                            }}>
                              <strong style={{ fontStyle: "normal" }}>Note:</strong> {lesson.note}
                            </div>
                          )}
                          {lesson.items.map((item, iIdx) => (
                            item.kind === "creator" ? (
                              (() => {
                                const Wrapper = item.url ? "a" : "div";
                                const wrapperProps = item.url ? { href: item.url, target: "_blank", rel: "noopener noreferrer" } : {};
                                return (
                                  <Wrapper
                                    key={iIdx}
                                    {...wrapperProps}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: TOKENS.ink,
                                      background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 5, padding: "12px 14px",
                                      opacity: item.url ? 1 : 0.75,
                                    }}
                                  >
                                    <div style={{
                                      width: 34, height: 34, borderRadius: "50%", background: TOKENS.navyMid, flexShrink: 0,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                      <Play size={14} color={TOKENS.gold} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600 }}>
                                        {item.name} <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.inkSoft, fontWeight: 400 }}>{item.handle}</span>
                                      </div>
                                      <div style={{ fontSize: 12.5, color: TOKENS.inkSoft, marginTop: 2 }}>{item.description}</div>
                                    </div>
                                    <span style={{
                                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 0.5,
                                      color: item.url ? TOKENS.gold : TOKENS.inkSoft, background: item.url ? TOKENS.navyMid : TOKENS.creamLine,
                                      padding: "3px 9px", borderRadius: 10, textTransform: "uppercase", flexShrink: 0,
                                    }}>
                                      {item.url ? (item.platform || "Visit") : "Link TBD"}
                                    </span>
                                  </Wrapper>
                                );
                              })()
                            ) : item.kind === "rich" ? (
                              <div key={iIdx} style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 5, padding: "16px" }}>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6, color: TOKENS.ink }}>
                                  {item.name}
                                </div>
                                {item.diagram && <Cover3Diagram variant={item.diagram} />}
                                {item.diagramConfig && <DefenseFieldDiagram {...item.diagramConfig} />}
                                {item.routesDiagram && <RoutesDiagram {...item.routesDiagram} />}
                                {item.runDiagram && <RunPlayDiagram {...item.runDiagram} />}
                                <div style={{ fontSize: 13, color: TOKENS.inkSoft, lineHeight: 1.5, marginBottom: 14 }}>
                                  {item.summary}
                                </div>
                                {item.badges && (
                                  <div style={{ marginBottom: 14 }}>
                                    <div style={{
                                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 0.5,
                                      color: TOKENS.inkSoft, textTransform: "uppercase", marginBottom: 8,
                                    }}>
                                      {item.badgesLabel || "STRUCTURE"}
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                                      {item.badges.map((b, bIdx) => (
                                        <div key={bIdx} style={{
                                          display: "flex", alignItems: "center", gap: 9,
                                          background: TOKENS.cream, border: `1px solid ${TOKENS.creamLine}`,
                                          borderRadius: 4, padding: "7px 10px",
                                        }}>
                                          <span style={{
                                            flexShrink: 0, minWidth: 26, height: 26, borderRadius: 4,
                                            background: TOKENS.navyMid, color: TOKENS.gold,
                                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 700,
                                            display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
                                          }}>
                                            {b.label}
                                          </span>
                                          <span style={{ fontSize: 12.5 }}>{b.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {item.keyText && (
                                  <div style={{ background: "#e8f3ea", borderRadius: 4, padding: "10px 12px", marginBottom: 14 }}>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 0.5, color: "#3c6e49", marginBottom: 3, textTransform: "uppercase" }}>
                                      {item.keyLabel || "WHAT IT ATTACKS"}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#2c5e38", lineHeight: 1.4 }}>{item.keyText}</div>
                                  </div>
                                )}
                                {item.qbRead && (
                                  <div style={{ marginBottom: 14 }}>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 0.5, color: TOKENS.inkSoft, marginBottom: 3, textTransform: "uppercase" }}>
                                      QB READ
                                    </div>
                                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>{item.qbRead}</div>
                                  </div>
                                )}
                                {item.coachingKey && (
                                  <div style={{ background: "#faf1dc", borderRadius: 4, padding: "10px 12px" }}>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 0.5, color: "#8a6a1f", marginBottom: 3, textTransform: "uppercase" }}>
                                      COACHING KEY
                                    </div>
                                    <div style={{ fontSize: 13, color: "#7a5a12", lineHeight: 1.4 }}>{item.coachingKey}</div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div key={iIdx} style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 5, padding: "12px 14px" }}>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14.5, fontWeight: 600, marginBottom: 5, color: TOKENS.ink }}>
                                  {item.name}
                                </div>
                                {item.formationDiagram && <FormationDiagram {...item.formationDiagram} />}
                                {item.positionsMap && <PositionsMapDiagram />}
                                {item.meshDiagram && <MeshPointDiagram />}
                                <div style={{ fontSize: 13, color: TOKENS.inkSoft, lineHeight: 1.5, marginBottom: 8 }}>
                                  {item.description}
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: item.videoId ? 10 : 0 }}>
                                  <span style={{
                                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 0.5,
                                    color: TOKENS.gold, background: TOKENS.navyMid, padding: "2px 7px", borderRadius: 9,
                                    textTransform: "uppercase", flexShrink: 0, marginTop: 1,
                                  }}>
                                    Coaching Point
                                  </span>
                                  <span style={{ fontSize: 13, lineHeight: 1.4, fontStyle: "italic" }}>{item.note}</span>
                                </div>
                                {item.videoId && (
                                  <a
                                    href={`https://www.youtube.com/watch?v=${item.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                                      fontSize: 12, color: TOKENS.navyMid, fontWeight: 600,
                                    }}
                                  >
                                    <Play size={11} /> Watch: {item.videoLabel || "Drill Example"}
                                  </a>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {tab === "drills" && (
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Drill Tracker
            </h1>
            <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
              Log reps as you go. Progress bars mark yardage to your target.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {DRILLS.map((d) => {
                const reps = drillReps[d.id] || 0;
                const pct = Math.round((reps / d.target) * 100);
                return (
                  <div key={d.id} style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600 }}>{d.title}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: TOKENS.inkSoft }}>
                        {reps} / {d.target} {d.unit}
                      </div>
                    </div>
                    <div style={{ position: "relative", height: 10, background: TOKENS.creamLine, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
                      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: TOKENS.gold, transition: "width 0.2s" }} />
                      {[20, 40, 60, 80].map((tick) => (
                        <div key={tick} style={{ position: "absolute", left: `${tick}%`, top: 0, bottom: 0, width: 1, background: TOKENS.cream, opacity: 0.6 }} />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => bumpDrill(d, d.step)}
                        style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                          padding: "7px 14px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                          borderRadius: 4, cursor: "pointer",
                        }}
                      >
                        +{d.step}
                      </button>
                      <button
                        onClick={() => bumpDrill(d, -d.step)}
                        style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                          padding: "7px 14px", background: "transparent", color: TOKENS.inkSoft,
                          border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4, cursor: "pointer",
                        }}
                      >
                        -{d.step}
                      </button>
                      {reps >= d.target && (
                        <span style={{ fontSize: 12.5, color: TOKENS.gold, fontWeight: 600, display: "flex", alignItems: "center", marginLeft: 4 }}>
                          Target reached
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "film" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 12 }}>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700 }}>Film Room</h1>
              <button
                onClick={() => requestCoachView("film")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
                  fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600,
                  background: showFilmCoachView ? TOKENS.navyMid : "transparent",
                  color: showFilmCoachView ? TOKENS.gold : TOKENS.navyMid,
                  border: `1px solid ${TOKENS.navyMid}`, borderRadius: 4, padding: "7px 12px", cursor: "pointer",
                }}
              >
                <Trophy size={13} /> {showFilmCoachView ? "Hide Coach View" : "Coach View"}
              </button>
            </div>
            <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
              Upload a throwing clip, add notes or ask a question about it, and build a log over time.
            </p>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12, color: TOKENS.inkSoft, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Example Film
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {EXAMPLE_FILMS.map((film) => (
                  <ExampleFilmCard key={film.id} film={film} />
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: TOKENS.inkSoft, marginTop: 12, fontStyle: "italic" }}>
                Curated clips from YouTube, one per subject — opens in a new tab.
              </div>
            </div>

            <div style={{ background: "#fff", border: `1px dashed ${TOKENS.creamLine}`, borderRadius: 6, padding: 20, marginBottom: 24 }}>
              {!pendingClip ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Upload size={26} color={TOKENS.inkSoft} style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 14, color: TOKENS.inkSoft, marginBottom: 14 }}>
                    Choose a video of a throw or drill rep
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFilePicked}
                    style={{ display: "none" }}
                    id="clip-upload"
                  />
                  <label
                    htmlFor="clip-upload"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
                      fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                      padding: "9px 18px", background: TOKENS.navyMid, color: TOKENS.gold, borderRadius: 4,
                    }}
                  >
                    <Plus size={15} /> Select Video
                  </label>
                </div>
              ) : (
                <div>
                  <video src={pendingClip.url} controls style={{ width: "100%", maxHeight: 320, borderRadius: 6, background: "#000", marginBottom: 12 }} />
                  <div style={{ fontSize: 13, color: TOKENS.inkSoft, marginBottom: 14 }}>{pendingClip.name}</div>

                  <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600, color: TOKENS.inkSoft, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                    Notes (optional)
                  </label>
                  <textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="What do you notice? e.g. front foot landing open, elbow dropping on deep throws..."
                    style={{
                      width: "100%", minHeight: 60, padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                      borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, resize: "vertical", marginBottom: 14,
                      boxSizing: "border-box",
                    }}
                  />

                  <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600, color: TOKENS.inkSoft, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                    <MessageCircleQuestion size={13} /> Ask about this clip (optional)
                  </label>
                  <textarea
                    value={clipQuestionDraft}
                    onChange={(e) => setClipQuestionDraft(e.target.value)}
                    placeholder='e.g. "What defensive coverage is this?"'
                    style={{
                      width: "100%", minHeight: 60, padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                      borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, resize: "vertical", marginBottom: 12,
                      boxSizing: "border-box",
                    }}
                  />

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={saveClip}
                      style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                        padding: "9px 18px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                        borderRadius: 4, cursor: "pointer",
                      }}
                    >
                      Save to Film Log
                    </button>
                    <button
                      onClick={() => { setPendingClip(null); setNoteDraft(""); setClipQuestionDraft(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                        padding: "9px 18px", background: "transparent", color: TOKENS.inkSoft,
                        border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4, cursor: "pointer",
                      }}
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {showFilmCoachView && (
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 10, color: TOKENS.inkSoft, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  All Submitted Film
                </div>
                {filmLog.length === 0 && (
                  <div style={{ fontSize: 13.5, color: TOKENS.inkSoft, fontStyle: "italic" }}>
                    No clips logged yet — submitted notes and questions will show up here.
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filmLog.map((clip) => (
                    <div key={clip.id} style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", background: TOKENS.navyMid, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Play size={13} color={TOKENS.gold} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 600 }}>{clip.name}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: TOKENS.inkSoft, whiteSpace: "nowrap" }}>{clip.date}</span>
                        </div>
                        {clip.notes && <div style={{ fontSize: 13, color: TOKENS.inkSoft, marginTop: 4 }}>{clip.notes}</div>}
                        {clip.question && (
                          <div style={{
                            marginTop: 8, background: TOKENS.cream, border: `1px solid ${TOKENS.creamLine}`,
                            borderRadius: 4, padding: "8px 10px",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                              <MessageCircleQuestion size={12} color={TOKENS.navyMid} />
                              <span style={{
                                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 0.5,
                                color: TOKENS.gold, background: TOKENS.navyMid, padding: "1px 7px", borderRadius: 9,
                                textTransform: "uppercase",
                              }}>
                                {clip.status || "Pending"}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, fontStyle: "italic" }}>{clip.question}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11.5, color: TOKENS.inkSoft, marginTop: 14, fontStyle: "italic" }}>
                  Note: this prototype doesn't store the video file itself — only the filename, notes, and any question submitted with it.
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "quiz" && (() => {
          const subjectFor = (id) => SUBJECTS.find((s) => s.id === id);
          const currentQ = quizQuestions[quizIndex];
          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 12 }}>
                <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700 }}>Quiz</h1>
                <button
                  onClick={() => requestCoachView("quiz")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
                    fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600,
                    background: showCoachView ? TOKENS.navyMid : "transparent",
                    color: showCoachView ? TOKENS.gold : TOKENS.navyMid,
                    border: `1px solid ${TOKENS.navyMid}`, borderRadius: 4, padding: "7px 12px", cursor: "pointer",
                  }}
                >
                  <Trophy size={13} /> {showCoachView ? "Hide Coach View" : "Coach View"}
                </button>
              </div>
              <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
                Eight random questions pulled from every subject — a fresh mix every time you play.
              </p>

              {showCoachView && (
                <div style={{ background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`, borderRadius: 6, padding: 18, marginBottom: 24, color: TOKENS.cream }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Trophy size={16} color={TOKENS.gold} />
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600 }}>All Quiz Results</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: TOKENS.creamLine, marginBottom: 12, fontStyle: "italic" }}>
                    Shared across everyone using this app — every player's results show up here.
                  </div>
                  {quizResults.length === 0 ? (
                    <div style={{ fontSize: 13.5, color: TOKENS.creamLine, fontStyle: "italic" }}>No quiz attempts yet.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {quizResults.map((r) => (
                        <div key={r.id} style={{
                          display: "flex", justifyContent: "space-between", gap: 10,
                          background: TOKENS.navyDeep, borderRadius: 4, padding: "8px 12px",
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: TOKENS.gold }}>{r.score}/{r.total}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: TOKENS.creamLine }}>{r.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!quizStarted && (
                <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 30, textAlign: "center" }}>
                  <Brain size={30} color={TOKENS.navyMid} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 14, color: TOKENS.inkSoft, marginBottom: 18 }}>
                    Test yourself across defense, offense, mechanics, rules, and more.
                  </div>
                  <button
                    onClick={startQuiz}
                    style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 13.5, fontWeight: 600, letterSpacing: 0.5,
                      padding: "10px 22px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                      borderRadius: 4, cursor: "pointer",
                    }}
                  >
                    Start Quiz
                  </button>
                </div>
              )}

              {quizStarted && !quizFinished && currentQ && (
                <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 0.5,
                      color: TOKENS.gold, background: TOKENS.navyMid, padding: "3px 8px", borderRadius: 10, textTransform: "uppercase",
                    }}>
                      {subjectFor(currentQ.subjectId)?.title || "General"}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: TOKENS.inkSoft }}>
                      {quizIndex + 1} / {quizQuestions.length}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 18, lineHeight: 1.4 }}>
                    {currentQ.prompt}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                    {currentQ.options.map((opt, i) => {
                      const answered = quizSelected !== null;
                      let bg = "#fff", border = TOKENS.creamLine, color = TOKENS.ink;
                      if (answered) {
                        if (opt.isCorrect) { bg = "#e8f3ea"; border = "#4a8f5c"; color = "#2c5e38"; }
                        else if (i === quizSelected) { bg = "#f6e6e3"; border = TOKENS.red; color = "#8a2e22"; }
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => selectAnswer(i)}
                          disabled={answered}
                          style={{
                            textAlign: "left", padding: "11px 14px", borderRadius: 4, fontSize: 13.5,
                            background: bg, border: `1.5px solid ${border}`, color,
                            cursor: answered ? "default" : "pointer",
                          }}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                  {quizSelected !== null && (
                    <button
                      onClick={nextQuestion}
                      style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                        padding: "9px 18px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                        borderRadius: 4, cursor: "pointer",
                      }}
                    >
                      {quizIndex + 1 >= quizQuestions.length ? "See Results" : "Next Question"}
                    </button>
                  )}
                </div>
              )}

              {quizStarted && quizFinished && (
                <div style={{ background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`, borderRadius: 6, padding: 30, textAlign: "center", color: TOKENS.cream }}>
                  <Trophy size={30} color={TOKENS.gold} style={{ marginBottom: 12 }} />
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
                    {quizAnswers.filter(Boolean).length} / {quizQuestions.length}
                  </div>
                  <div style={{ fontSize: 13.5, color: TOKENS.creamLine, marginBottom: 20 }}>
                    Saved to your coach's results — nice work.
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button
                      onClick={startQuiz}
                      style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                        padding: "9px 18px", background: TOKENS.gold, color: TOKENS.navyDeep, border: "none",
                        borderRadius: 4, cursor: "pointer",
                      }}
                    >
                      Retake Quiz
                    </button>
                    <button
                      onClick={() => setQuizStarted(false)}
                      style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                        padding: "9px 18px", background: "transparent", color: TOKENS.cream,
                        border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4, cursor: "pointer",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {tab === "questions" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 12 }}>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700 }}>Ask the QB Coach</h1>
              <button
                onClick={() => requestCoachView("questions")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
                  fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600,
                  background: showQuestionsCoachView ? TOKENS.navyMid : "transparent",
                  color: showQuestionsCoachView ? TOKENS.gold : TOKENS.navyMid,
                  border: `1px solid ${TOKENS.navyMid}`, borderRadius: 4, padding: "7px 12px", cursor: "pointer",
                }}
              >
                <Trophy size={13} /> {showQuestionsCoachView ? "Hide Coach View" : "Coach View"}
              </button>
            </div>
            <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
              Stuck on a read, a rule, or a drill? Submit it here and it'll be waiting for your coach at your next session.
            </p>

            <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 18, marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <MessageCircleQuestion size={18} color={TOKENS.navyMid} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600 }}>Your question</span>
              </div>
              <textarea
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                placeholder="e.g. How do I tell zone coverage from man before the snap?"
                style={{
                  width: "100%", minHeight: 90, padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                  borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, resize: "vertical", marginBottom: 12,
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={submitQuestion}
                disabled={!questionDraft.trim()}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                  padding: "9px 18px", background: questionDraft.trim() ? TOKENS.navyMid : TOKENS.creamLine,
                  color: questionDraft.trim() ? TOKENS.gold : TOKENS.inkSoft, border: "none",
                  borderRadius: 4, cursor: questionDraft.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Send size={14} /> Submit Question
              </button>
              <div style={{ fontSize: 11, color: TOKENS.inkSoft, marginTop: 10, fontStyle: "italic" }}>
                Submitted questions are shared and reviewed by the coach behind QB Vision 360.
              </div>
            </div>

            {showQuestionsCoachView && (
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 10, color: TOKENS.inkSoft, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  All Submitted Questions
                </div>
                {questions.length === 0 && (
                  <div style={{ fontSize: 13.5, color: TOKENS.inkSoft, fontStyle: "italic" }}>
                    No questions submitted yet — anything asked will show up here.
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {questions.map((q) => (
                    <div key={q.id} style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 0.5,
                          color: TOKENS.gold, background: TOKENS.navyMid, padding: "2px 8px", borderRadius: 10,
                          textTransform: "uppercase",
                        }}>
                          <Clock size={11} /> {q.status}
                        </span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: TOKENS.inkSoft, whiteSpace: "nowrap" }}>{q.date}</span>
                      </div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.4 }}>{q.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "plan" && (
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Build a Plan
            </h1>
            <p style={{ color: TOKENS.inkSoft, marginBottom: 24, fontSize: 14.5 }}>
              Set a goal, pick your focus, and track the work that gets you there.
            </p>

            {/* Season Goal */}
            <div style={{ background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`, borderRadius: 6, padding: 20, marginBottom: 20, color: TOKENS.cream }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Target size={17} color={TOKENS.gold} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600 }}>Season Goal</span>
              </div>
              {!editingGoal ? (
                <div>
                  <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 14 }}>{plan.seasonGoal}</div>
                  <button
                    onClick={() => { setGoalDraft(plan.seasonGoal); setEditingGoal(true); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontFamily: "'Oswald', sans-serif", fontSize: 12, fontWeight: 600,
                      background: "transparent", color: TOKENS.gold, border: `1px solid ${TOKENS.gold}`,
                      borderRadius: 4, padding: "6px 12px", cursor: "pointer",
                    }}
                  >
                    <Pencil size={11} /> Edit Goal
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    value={goalDraft}
                    onChange={(e) => setGoalDraft(e.target.value)}
                    placeholder='e.g. "Start varsity by grade 11" or "Cut my interceptions in half this season"'
                    style={{
                      width: "100%", minHeight: 70, padding: 10, border: `1px solid ${TOKENS.navyLine}`,
                      borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, resize: "vertical",
                      boxSizing: "border-box", marginBottom: 10, background: "#fff", color: TOKENS.ink,
                    }}
                  />
                  <button
                    onClick={saveGoal}
                    style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "8px 16px", background: TOKENS.gold, color: TOKENS.navyDeep, border: "none",
                      borderRadius: 4, cursor: "pointer",
                    }}
                  >
                    Save Goal
                  </button>
                </div>
              )}

              <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${TOKENS.navyLine}` }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 0.5, color: TOKENS.creamLine, textTransform: "uppercase", marginBottom: 10 }}>
                  Focus Areas — pick up to 3
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SUBJECTS.map((s) => {
                    const active = plan.focusAreas.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleFocusArea(s.id)}
                        style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600,
                          padding: "7px 12px", borderRadius: 14, cursor: "pointer",
                          background: active ? TOKENS.gold : "transparent",
                          color: active ? TOKENS.navyDeep : TOKENS.creamLine,
                          border: `1px solid ${active ? TOKENS.gold : TOKENS.navyLine}`,
                        }}
                      >
                        {s.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* This Week's Focus */}
            <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <CheckSquare size={17} color={TOKENS.navyMid} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600 }}>This Week's Focus</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <input
                  type="text"
                  value={weekFocusDraft}
                  onChange={(e) => setWeekFocusDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addWeekFocusItem(); }}
                  placeholder="e.g. Watch the Cover 3 lesson, run footwork ladder x3"
                  style={{
                    flex: 1, padding: 10, border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4,
                    fontFamily: "'Inter', sans-serif", fontSize: 13.5, boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={addWeekFocusItem}
                  style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                    padding: "0 16px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                    borderRadius: 4, cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
              {weekFocus.length === 0 ? (
                <div style={{ fontSize: 13.5, color: TOKENS.inkSoft, fontStyle: "italic" }}>Nothing on the list yet — add what you're working on this week.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {weekFocus.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, background: TOKENS.cream, borderRadius: 4, padding: "9px 12px" }}>
                      <button
                        onClick={() => toggleWeekFocusItem(item.id)}
                        style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0, padding: 0,
                          border: `2px solid ${item.done ? TOKENS.gold : TOKENS.creamLine}`,
                          background: item.done ? TOKENS.gold : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }}
                      >
                        {item.done && <Check size={12} color={TOKENS.navyDeep} />}
                      </button>
                      <span style={{ flex: 1, fontSize: 13.5, textDecoration: item.done ? "line-through" : "none", color: item.done ? TOKENS.inkSoft : TOKENS.ink }}>
                        {item.text}
                      </span>
                      <button onClick={() => removeWeekFocusItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: TOKENS.inkSoft }}>
                        <XIcon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Milestones */}
            <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Flag size={17} color={TOKENS.navyMid} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600 }}>Milestones</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={milestoneDraft}
                  onChange={(e) => setMilestoneDraft(e.target.value)}
                  placeholder="e.g. Complete all Mechanics lessons"
                  style={{
                    flex: "1 1 200px", padding: 10, border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4,
                    fontFamily: "'Inter', sans-serif", fontSize: 13.5, boxSizing: "border-box",
                  }}
                />
                <input
                  type="date"
                  value={milestoneDateDraft}
                  onChange={(e) => setMilestoneDateDraft(e.target.value)}
                  style={{
                    padding: 10, border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4,
                    fontFamily: "'Inter', sans-serif", fontSize: 13.5, boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={addMilestone}
                  style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                    padding: "0 16px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                    borderRadius: 4, cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
              {milestones.length === 0 ? (
                <div style={{ fontSize: 13.5, color: TOKENS.inkSoft, fontStyle: "italic" }}>No milestones yet — add a target and a date.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {milestones.map((m) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, background: TOKENS.cream, borderRadius: 4, padding: "9px 12px" }}>
                      <button
                        onClick={() => toggleMilestone(m.id)}
                        style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0, padding: 0,
                          border: `2px solid ${m.done ? TOKENS.gold : TOKENS.creamLine}`,
                          background: m.done ? TOKENS.gold : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }}
                      >
                        {m.done && <Check size={12} color={TOKENS.navyDeep} />}
                      </button>
                      <span style={{ flex: 1, fontSize: 13.5, textDecoration: m.done ? "line-through" : "none", color: m.done ? TOKENS.inkSoft : TOKENS.ink }}>
                        {m.text}
                      </span>
                      {m.date && (
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: TOKENS.inkSoft, whiteSpace: "nowrap" }}>
                          {m.date}
                        </span>
                      )}
                      <button onClick={() => removeMilestone(m.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: TOKENS.inkSoft }}>
                        <XIcon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly Reflection Log */}
            <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <BookOpen size={17} color={TOKENS.navyMid} />
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600 }}>Reflection Log</span>
              </div>
              <textarea
                value={reflectionDraft}
                onChange={(e) => setReflectionDraft(e.target.value)}
                placeholder="What did you work on this week? What clicked, what didn't?"
                style={{
                  width: "100%", minHeight: 70, padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                  borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, resize: "vertical",
                  boxSizing: "border-box", marginBottom: 10,
                }}
              />
              <button
                onClick={addReflection}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                  padding: "9px 18px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                  borderRadius: 4, cursor: "pointer", marginBottom: 18,
                }}
              >
                Log Entry
              </button>
              {reflections.length === 0 ? (
                <div style={{ fontSize: 13.5, color: TOKENS.inkSoft, fontStyle: "italic" }}>No entries yet — your weekly notes will build up here.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {reflections.map((r) => (
                    <div key={r.id} style={{ background: TOKENS.cream, borderRadius: 4, padding: "10px 12px" }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.inkSoft, marginBottom: 4 }}>{r.date}</div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.4 }}>{r.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Build Your Profile
            </h1>
            <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
              A little bit about you as a quarterback — what drives you, and who you look up to. By adding your profile and telling us what you want to work on, you give us the ability to change and customize content for your specific age group and skill level.
            </p>

            {!editingProfile ? (
              <div style={{
                background: TOKENS.navyMid, border: `1px solid ${TOKENS.navyLine}`, borderRadius: 6,
                padding: 22, color: TOKENS.cream,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: "50%", background: TOKENS.navyDeep,
                      border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <User size={20} color={TOKENS.gold} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 19, fontWeight: 700 }}>
                        {profile.name || "Unnamed QB"}
                      </div>
                      {profile.level && (
                        <div style={{ fontSize: 12.5, color: TOKENS.creamLine }}>{profile.level}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setProfileDraft(profile); setEditingProfile(true); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontFamily: "'Oswald', sans-serif", fontSize: 12.5, fontWeight: 600,
                      background: "transparent", color: TOKENS.gold, border: `1px solid ${TOKENS.gold}`,
                      borderRadius: 4, padding: "6px 12px", cursor: "pointer",
                    }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {PROFILE_QUESTIONS.filter((q) => q.id !== "name" && q.id !== "level").map((q) => (
                    profile[q.id] ? (
                      <div key={q.id}>
                        <div style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 0.5,
                          color: TOKENS.gold, textTransform: "uppercase", marginBottom: 4,
                        }}>
                          {q.label}
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.5 }}>{profile[q.id]}</div>
                      </div>
                    ) : null
                  ))}
                </div>
                {SOCIAL_LINKS.some((s) => profile[s.id]) && (
                  <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${TOKENS.navyLine}` }}>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 0.5,
                      color: TOKENS.gold, textTransform: "uppercase", marginBottom: 10,
                    }}>
                      Social Media
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {SOCIAL_LINKS.filter((s) => profile[s.id]).map((s) => (
                        <a
                          key={s.id}
                          href={socialUrl(s, profile[s.id])}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex", alignItems: "center", gap: 7, textDecoration: "none",
                            background: TOKENS.navyDeep, border: `1px solid ${TOKENS.navyLine}`, borderRadius: 16,
                            padding: "6px 12px 6px 6px",
                          }}
                        >
                          <span style={{
                            width: 22, height: 22, borderRadius: "50%", background: TOKENS.gold, color: TOKENS.navyDeep,
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            {s.badge}
                          </span>
                          <span style={{ fontSize: 12.5, color: TOKENS.cream }}>{profile[s.id]}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {PROFILE_QUESTIONS.map((q) => (
                    <div key={q.id}>
                      <label style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, color: TOKENS.ink,
                        display: "block", marginBottom: 6,
                      }}>
                        {q.label}
                      </label>
                      {q.type === "short" ? (
                        <input
                          type="text"
                          value={profileDraft[q.id] || ""}
                          onChange={(e) => setProfileDraft({ ...profileDraft, [q.id]: e.target.value })}
                          placeholder={q.placeholder}
                          style={{
                            width: "100%", padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                            borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5,
                            boxSizing: "border-box",
                          }}
                        />
                      ) : (
                        <textarea
                          value={profileDraft[q.id] || ""}
                          onChange={(e) => setProfileDraft({ ...profileDraft, [q.id]: e.target.value })}
                          placeholder={q.placeholder}
                          style={{
                            width: "100%", minHeight: 70, padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                            borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, resize: "vertical",
                            boxSizing: "border-box",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${TOKENS.creamLine}` }}>
                  <div style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, color: TOKENS.ink, marginBottom: 12,
                  }}>
                    Social Media
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {SOCIAL_LINKS.map((s) => (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          width: 34, height: 34, borderRadius: "50%", background: TOKENS.navyMid, color: TOKENS.gold,
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 700, flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {s.badge}
                        </span>
                        <input
                          type="text"
                          value={profileDraft[s.id] || ""}
                          onChange={(e) => setProfileDraft({ ...profileDraft, [s.id]: e.target.value })}
                          placeholder={s.placeholder}
                          style={{
                            flex: 1, padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                            borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5,
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  <button
                    onClick={saveProfile}
                    style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                      padding: "9px 18px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                      borderRadius: 4, cursor: "pointer",
                    }}
                  >
                    Save Profile
                  </button>
                  {Object.values(profile).some((v) => v && v.trim()) && (
                    <button
                      onClick={() => { setProfileDraft(profile); setEditingProfile(false); }}
                      style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                        padding: "9px 18px", background: "transparent", color: TOKENS.inkSoft,
                        border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4, cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "achievements" && (() => {
          const totalLessons = SUBJECTS.reduce((sum, s) => sum + s.lessons.length, 0);
          const completedLessons = SUBJECTS.reduce((sum, s) => {
            const done = progress[s.id] || {};
            return sum + s.lessons.filter((_, i) => done[i]).length;
          }, 0);
          const anySubjectComplete = SUBJECTS.some((s) => {
            const done = progress[s.id] || {};
            return s.lessons.length > 0 && s.lessons.every((_, i) => done[i]);
          });
          const everySubjectStarted = SUBJECTS.every((s) => {
            const done = progress[s.id] || {};
            return s.lessons.some((_, i) => done[i]);
          });
          const anyDrillMaxed = DRILLS.some((d) => (drillReps[d.id] || 0) >= d.target);
          const allDrillsMaxed = DRILLS.every((d) => (drillReps[d.id] || 0) >= d.target);

          const state = {
            completedLessons, totalLessons, anySubjectComplete, everySubjectStarted,
            anyDrillMaxed, allDrillsMaxed, plan, reflections, milestones, profile,
          };

          const earnedCount = BADGES.filter((b) => b.check(state)).length;

          return (
            <div>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
                Achievements
              </h1>
              <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
                {earnedCount} of {BADGES.length} badges earned. Keep training to unlock the rest.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {BADGES.map((b) => {
                  const earned = b.check(state);
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.id}
                      style={{
                        background: earned ? TOKENS.navyMid : "#fff",
                        border: `1px solid ${earned ? TOKENS.navyLine : TOKENS.creamLine}`,
                        borderRadius: 6, padding: 16, position: "relative", opacity: earned ? 1 : 0.7,
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: earned ? TOKENS.navyDeep : TOKENS.cream,
                        border: `2px solid ${earned ? TOKENS.gold : TOKENS.creamLine}`,
                        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
                      }}>
                        {earned ? <Icon size={18} color={TOKENS.gold} /> : <Lock size={16} color={TOKENS.inkSoft} />}
                      </div>
                      <div style={{
                        fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 4,
                        color: earned ? TOKENS.cream : TOKENS.ink,
                      }}>
                        {b.name}
                      </div>
                      <div style={{ fontSize: 12, color: earned ? TOKENS.creamLine : TOKENS.inkSoft, lineHeight: 1.4 }}>
                        {b.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {tab === "coach" && (() => {
          if (!coachUnlocked) {
            return (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Trophy size={28} color={TOKENS.navyMid} style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 14, color: TOKENS.inkSoft, marginBottom: 16 }}>This section is locked.</div>
                <button
                  onClick={openCoachDashboard}
                  style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                    padding: "9px 18px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                    borderRadius: 4, cursor: "pointer",
                  }}
                >
                  Enter Passcode
                </button>
              </div>
            );
          }

          const avgQuizPct = quizResults.length
            ? Math.round((quizResults.reduce((sum, r) => sum + r.score / r.total, 0) / quizResults.length) * 100)
            : null;

          const statCards = [
            { label: "Questions", value: questions.length, icon: MessageCircleQuestion },
            { label: "Film Submissions", value: filmLog.length, icon: Play },
            { label: "Quiz Attempts", value: quizResults.length, icon: Brain },
            { label: "Feedback Items", value: feedbackList.length, icon: Heart },
          ];

          return (
            <div>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
                Coach Dashboard
              </h1>
              <p style={{ color: TOKENS.inkSoft, marginBottom: 22, fontSize: 14.5 }}>
                Everything submitted across the app, in one place.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 26 }}>
                {statCards.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} style={{ background: TOKENS.navyMid, borderRadius: 6, padding: "14px 16px", color: TOKENS.cream }}>
                      <Icon size={15} color={TOKENS.gold} style={{ marginBottom: 6 }} />
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: TOKENS.creamLine }}>{s.label}</div>
                    </div>
                  );
                })}
                {avgQuizPct !== null && (
                  <div style={{ background: TOKENS.navyMid, borderRadius: 6, padding: "14px 16px", color: TOKENS.cream }}>
                    <Trophy size={15} color={TOKENS.gold} style={{ marginBottom: 6 }} />
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700 }}>{avgQuizPct}%</div>
                    <div style={{ fontSize: 11, color: TOKENS.creamLine }}>Avg Quiz Score</div>
                  </div>
                )}
              </div>

              {[
                { title: "Recent Questions", items: questions, render: (q) => (<><div style={{ fontSize: 13, lineHeight: 1.4 }}>{q.text}</div><div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.inkSoft, marginTop: 4 }}>{q.date} · {q.status}</div></>) },
                { title: "Recent Film Submissions", items: filmLog, render: (f) => (<><div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>{f.notes && <div style={{ fontSize: 12.5, color: TOKENS.inkSoft, marginTop: 2 }}>{f.notes}</div>}{f.question && <div style={{ fontSize: 12.5, fontStyle: "italic", marginTop: 2 }}>Q: {f.question}</div>}<div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.inkSoft, marginTop: 4 }}>{f.date}</div></>) },
                { title: "Recent Quiz Results", items: quizResults, render: (r) => (<><div style={{ fontSize: 13, fontWeight: 600 }}>{r.name} — {r.score}/{r.total}</div><div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.inkSoft, marginTop: 4 }}>{r.date}</div></>) },
                { title: "Recent Feedback", items: feedbackList, render: (f) => (<><div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div><div style={{ fontSize: 12.5, color: TOKENS.inkSoft, marginTop: 2 }}>{f.text}</div><div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.inkSoft, marginTop: 4 }}>{f.date}</div></>) },
              ].map((section) => (
                <div key={section.title} style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 10, color: TOKENS.inkSoft, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {section.title}
                  </div>
                  {section.items.length === 0 ? (
                    <div style={{ fontSize: 13, color: TOKENS.inkSoft, fontStyle: "italic" }}>Nothing yet.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {section.items.slice(0, 8).map((item) => (
                        <div key={item.id} style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: "10px 14px" }}>
                          {section.render(item)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}

        {tab === "about" && (
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Parents & Coaches
            </h1>
            <p style={{ color: TOKENS.inkSoft, marginBottom: 24, fontSize: 14.5 }}>
              Feedback, suggestions, and ways to support the project.
            </p>

            <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 20, marginBottom: 20 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                Feedback & Suggestions
              </div>
              <p style={{ fontSize: 13, color: TOKENS.inkSoft, marginBottom: 14 }}>
                This app is a work in progress. If you have thoughts, ideas, or something you'd like to see added, let me know here.
              </p>
              <input
                type="text"
                value={feedbackNameDraft}
                onChange={(e) => setFeedbackNameDraft(e.target.value)}
                placeholder="Your name (optional)"
                style={{
                  width: "100%", padding: 10, border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4,
                  fontFamily: "'Inter', sans-serif", fontSize: 13.5, boxSizing: "border-box", marginBottom: 10,
                }}
              />
              <textarea
                value={feedbackDraft}
                onChange={(e) => setFeedbackDraft(e.target.value)}
                placeholder="Feedback, a bug you noticed, or a subject/feature you'd like to see..."
                style={{
                  width: "100%", minHeight: 80, padding: 10, border: `1px solid ${TOKENS.creamLine}`,
                  borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 13.5, resize: "vertical",
                  boxSizing: "border-box", marginBottom: 12,
                }}
              />
              <button
                onClick={submitFeedback}
                disabled={!feedbackDraft.trim()}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                  padding: "9px 18px", background: feedbackDraft.trim() ? TOKENS.navyMid : TOKENS.creamLine,
                  color: feedbackDraft.trim() ? TOKENS.gold : TOKENS.inkSoft, border: "none",
                  borderRadius: 4, cursor: feedbackDraft.trim() ? "pointer" : "not-allowed",
                }}
              >
                Send Feedback
              </button>
              <div style={{ fontSize: 11, color: TOKENS.inkSoft, marginTop: 10, fontStyle: "italic" }}>
                Submitted feedback is shared and reviewed by the coach behind QB Vision 360.
              </div>
              {feedbackList.length > 0 && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${TOKENS.creamLine}` }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 0.5,
                    color: TOKENS.inkSoft, textTransform: "uppercase", marginBottom: 10,
                  }}>
                    Recent Feedback
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {feedbackList.slice(0, 5).map((f) => (
                      <div key={f.id} style={{ background: TOKENS.cream, borderRadius: 4, padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 3 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{f.name}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.inkSoft }}>{f.date}</span>
                        </div>
                        <div style={{ fontSize: 13, lineHeight: 1.4 }}>{f.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", border: `1px solid ${TOKENS.creamLine}`, borderRadius: 6, padding: 20, textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                Support This Project
              </div>
              <p style={{ fontSize: 13, color: TOKENS.inkSoft, marginBottom: 14 }}>
                QB Vision 360 is built and maintained independently. If it's helped your player, you're welcome to support it here.
              </p>
              {SUPPORT_URL ? (
                <a
                  href={SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
                    fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                    background: TOKENS.navyMid, color: TOKENS.gold, borderRadius: 4, padding: "9px 18px",
                  }}
                >
                  <Heart size={13} /> Support QB Vision 360
                </a>
              ) : (
                <span style={{ fontSize: 12, color: TOKENS.inkSoft, fontStyle: "italic" }}>
                  Support link coming soon.
                </span>
              )}
            </div>
          </div>
        )}
      </main>

      {showWalkthrough && (() => {
        const step = WALKTHROUGH_STEPS[walkthroughStep];
        const StepIcon = step.icon;
        const isLast = walkthroughStep === WALKTHROUGH_STEPS.length - 1;
        return (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(15,29,51,0.75)", display: "flex",
              alignItems: "center", justifyContent: "center", padding: 20, zIndex: 110,
            }}
          >
            <div style={{ background: TOKENS.navyMid, borderRadius: 10, padding: 28, maxWidth: 360, width: "100%", color: TOKENS.cream, textAlign: "center" }}>
              {StepIcon ? (
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", background: TOKENS.navyDeep, margin: "0 auto 16px",
                  border: `2px solid ${TOKENS.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <StepIcon size={24} color={TOKENS.gold} />
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <CompassMark size={56} />
                </div>
              )}
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 8 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 13.5, color: TOKENS.creamLine, lineHeight: 1.55, marginBottom: 22 }}>
                {step.body}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
                {WALKTHROUGH_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === walkthroughStep ? 18 : 6, height: 6, borderRadius: 3,
                      background: i === walkthroughStep ? TOKENS.gold : TOKENS.navyLine,
                      transition: "width 0.2s",
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {walkthroughStep > 0 ? (
                  <button
                    onClick={() => setWalkthroughStep(walkthroughStep - 1)}
                    style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "10px 16px", background: "transparent", color: TOKENS.creamLine,
                      border: `1px solid ${TOKENS.navyLine}`, borderRadius: 4, cursor: "pointer",
                    }}
                  >
                    Back
                  </button>
                ) : (
                  <button
                    onClick={finishWalkthrough}
                    style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "10px 16px", background: "transparent", color: TOKENS.creamLine,
                      border: `1px solid ${TOKENS.navyLine}`, borderRadius: 4, cursor: "pointer",
                    }}
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={nextWalkthroughStep}
                  style={{
                    flex: 1, fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700,
                    padding: "10px 16px", background: TOKENS.gold, color: TOKENS.navyDeep, border: "none",
                    borderRadius: 4, cursor: "pointer",
                  }}
                >
                  {isLast ? "Get Started" : "Next"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showPasscodePrompt && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(15,29,51,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100,
          }}
          onClick={() => setShowPasscodePrompt(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 8, padding: 24, maxWidth: 320, width: "100%" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Trophy size={16} color={TOKENS.navyMid} />
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700 }}>Coach View</span>
            </div>
            <p style={{ fontSize: 12.5, color: TOKENS.inkSoft, marginBottom: 14 }}>
              Enter the coach passcode to continue.
            </p>
            <input
              type="password"
              autoFocus
              value={passcodeDraft}
              onChange={(e) => { setPasscodeDraft(e.target.value); setPasscodeError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") submitPasscode(); }}
              placeholder="Passcode"
              style={{
                width: "100%", padding: 10, border: `1px solid ${passcodeError ? TOKENS.red : TOKENS.creamLine}`,
                borderRadius: 4, fontFamily: "'Inter', sans-serif", fontSize: 14, boxSizing: "border-box", marginBottom: 8,
              }}
            />
            {passcodeError && (
              <div style={{ fontSize: 12, color: TOKENS.red, marginBottom: 8 }}>
                That's not right — try again.
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                onClick={submitPasscode}
                style={{
                  flex: 1, fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                  padding: "9px 14px", background: TOKENS.navyMid, color: TOKENS.gold, border: "none",
                  borderRadius: 4, cursor: "pointer",
                }}
              >
                Unlock
              </button>
              <button
                onClick={() => setShowPasscodePrompt(false)}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                  padding: "9px 14px", background: "transparent", color: TOKENS.inkSoft,
                  border: `1px solid ${TOKENS.creamLine}`, borderRadius: 4, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
