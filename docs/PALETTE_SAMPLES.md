# ForgeUI — Palette & Design Language Samples

10 candidate palettes with sample component mockups. Each explores a different
personality for the design system while maintaining dark-first, game-dev-tool
aesthetics.

Pick the ones that resonate and we'll refine from there.

---

## Sample 1: "Midnight Forge" (Navy Foundation)

**Personality:** Professional, deep, slightly cool. Feels like a premium IDE.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #0a0a1a  ████████████████  Near-black navy  │
│  Surface    #121830  ████████████████  Dark navy        │
│  Raised     #1e2d4a  ████████████████  Muted steel blue │
│  Border     #2a3f5f  ████████████████  Soft blue edge   │
│  Text       #e0e4ec  ████████████████  Cool white       │
│  Muted      #8892a8  ████████████████  Slate            │
│                                                         │
│  Accent     #4f8ff7  ████████████████  Bright blue      │
│  Success    #34d399  ████████████████  Emerald          │
│  Warning    #fbbf24  ████████████████  Amber            │
│  Danger     #f87171  ████████████████  Coral red        │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #4f8ff7 bg │  │  border only│  │  #f87171 bg │  │
│  │  white text │  │  #e0e4ec txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #121830 bg, #2a3f5f border, 6px radius │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  ┌─ Active ─┐  ┌─ Draft ──┐  ┌─ Error ┐ │        │
│  │  │ #34d399  │  │ #fbbf24  │  │ #f87171│ │        │
│  │  └──────────┘  └──────────┘  └────────┘ │        │
│  │  Badges: pill shape, semitransparent bg  │        │
│  └──────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────┘
```

**Character:** Cool, trustworthy. Recedes into the background — content is king.

---

## Sample 2: "Obsidian" (True Neutral Dark)

**Personality:** Minimal, monochromatic. Lets colorful game content pop.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #0f0f0f  ████████████████  Near-black       │
│  Surface    #1a1a1a  ████████████████  Charcoal         │
│  Raised     #262626  ████████████████  Dark gray        │
│  Border     #333333  ████████████████  Medium gray      │
│  Text       #e5e5e5  ████████████████  Warm white       │
│  Muted      #737373  ████████████████  Neutral gray     │
│                                                         │
│  Accent     #a78bfa  ████████████████  Soft violet      │
│  Success    #4ade80  ████████████████  Bright green     │
│  Warning    #fb923c  ████████████████  Orange           │
│  Danger     #ef4444  ████████████████  Pure red         │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #a78bfa bg │  │  #333 bordr │  │  #ef4444 bg │  │
│  │  #0f0f0f txt│  │  #e5e5e5 txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #1a1a1a bg, #333 border, 4px radius    │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Badges: rounded rectangle, 2px radius               │
│  ┌─ Active ─┐  ┌── Draft ──┐  ┌── Error ──┐         │
│  │ #4ade80  │  │ #fb923c   │  │ #ef4444   │         │
│  └──────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
```

**Character:** Neutral canvas. Purple accent is distinctive without being loud.
Sharper corners (4px) give it a more technical, precise feel.

---

## Sample 3: "Ember" (Warm Industrial)

**Personality:** Warm, grounded, forge-inspired. Evokes crafting and creation.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #0d0b0a  ████████████████  Warm black       │
│  Surface    #1c1816  ████████████████  Dark brown-gray  │
│  Raised     #2a2320  ████████████████  Warm charcoal    │
│  Border     #3d3430  ████████████████  Bronze edge      │
│  Text       #ede8e3  ████████████████  Warm cream       │
│  Muted      #8a7e76  ████████████████  Taupe            │
│                                                         │
│  Accent     #f59e0b  ████████████████  Amber/Gold       │
│  Success    #22c55e  ████████████████  Forest green     │
│  Warning    #f97316  ████████████████  Deep orange      │
│  Danger     #dc2626  ████████████████  Brick red        │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #f59e0b bg │  │  #3d3430 bdr│  │  #dc2626 bg │  │
│  │  #0d0b0a txt│  │  #ede8e3 txt│  │  cream text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #1c1816 bg, #3d3430 border, 6px radius │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Badges: warm tint fills, 8px radius (softer)        │
│  ┌─ Active ─┐  ┌── Draft ──┐  ┌── Error ──┐         │
│  │ #22c55e  │  │ #f59e0b   │  │ #dc2626   │         │
│  └──────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
```

**Character:** Thematic — "ForgeUI" literally feels like a forge. Warm tones
are distinctive but risk feeling muddy if not carefully balanced.

---

## Sample 4: "Neon Terminal" (High Contrast Cyber)

**Personality:** Futuristic, high-energy. Inspired by cyberpunk terminals and HUDs.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #030712  ████████████████  Ink black-blue   │
│  Surface    #0a1628  ████████████████  Deep navy        │
│  Raised     #112240  ████████████████  Dark teal hint   │
│  Border     #1e3a5f  ████████████████  Steel blue       │
│  Text       #f0f6ff  ████████████████  Ice white        │
│  Muted      #64748b  ████████████████  Slate blue       │
│                                                         │
│  Accent     #06b6d4  ████████████████  Cyan             │
│  Success    #10b981  ████████████████  Teal green       │
│  Warning    #eab308  ████████████████  Electric yellow  │
│  Danger     #f43f5e  ████████████████  Hot pink-red     │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #06b6d4 bg │  │  #1e3a5f bdr│  │  #f43f5e bg │  │
│  │  #030712 txt│  │  #f0f6ff txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ══════════════════════════════════════  │        │
│  │  #0a1628 bg, #06b6d4 focus glow, 2px r  │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Badges: glow effect, tight 2px radius               │
│  ┌─ Active ─┐  ┌── Draft ──┐  ┌── Error ──┐         │
│  │ #10b981  │  │ #eab308   │  │ #f43f5e   │         │
│  │ glow     │  │ glow      │  │ glow      │         │
│  └──────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
```

**Character:** Eye-catching, gaming-native. Cyan accent is energetic. Risk:
glow effects + high saturation can cause eye fatigue in long sessions.

---

## Sample 5: "Slate" (Muted Professional)

**Personality:** Calm, mature, enterprise-feeling. Like Linear or Notion in dark mode.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #111116  ████████████████  Muted off-black  │
│  Surface    #1c1c24  ████████████████  Dark slate       │
│  Raised     #26262f  ████████████████  Warm gray-purple │
│  Border     #35353f  ████████████████  Subtle edge      │
│  Text       #ececef  ████████████████  Near white       │
│  Muted      #7e7e8a  ████████████████  Cool gray        │
│                                                         │
│  Accent     #818cf8  ████████████████  Soft indigo      │
│  Success    #34d399  ████████████████  Mint green       │
│  Warning    #fbbf24  ████████████████  Amber            │
│  Danger     #f87171  ████████████████  Soft red         │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #818cf8 bg │  │  #35353f bdr│  │  ghost style │  │
│  │  white text │  │  #ececef txt│  │  #f87171 txt│  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #1c1c24 bg, #35353f border, 8px radius │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Badges: muted bg fills, high radius (pill)          │
│  ┌─ Active ─┐  ┌── Draft ──┐  ┌── Error ──┐         │
│  │ #34d399  │  │ #fbbf24   │  │ #f87171   │         │
│  │ 15% bg   │  │ 15% bg    │  │ 15% bg    │         │
│  └──────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
```

**Character:** Refined, understated. Badges use 15% opacity fills rather than
solid colors — looks polished but risks being too subtle for status indicators.

---

## Sample 6: "Deep Space" (Dark with Teal Accent)

**Personality:** Sci-fi tool aesthetic. Think Unreal Engine meets VS Code.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #07090e  ████████████████  Space black      │
│  Surface    #0e1420  ████████████████  Midnight         │
│  Raised     #162032  ████████████████  Deep blue-gray   │
│  Border     #243044  ████████████████  Muted steel      │
│  Text       #d4dae5  ████████████████  Soft white-blue  │
│  Muted      #6b7a90  ████████████████  Steel            │
│                                                         │
│  Accent     #14b8a6  ████████████████  Teal             │
│  Success    #22c55e  ████████████████  Green            │
│  Warning    #f59e0b  ████████████████  Amber            │
│  Danger     #ef4444  ████████████████  Red              │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #14b8a6 bg │  │  #243044 bdr│  │  #ef4444 bg │  │
│  │  #07090e txt│  │  #d4dae5 txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #0e1420 bg, #243044 border, 6px radius │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Badges: tinted fill, 6px radius                     │
│  ┌─ Active ─┐  ┌── Draft ──┐  ┌── Error ──┐         │
│  │ #22c55e  │  │ #f59e0b   │  │ #ef4444   │         │
│  └──────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
```

**Character:** Teal accent stands out sharply against dark blues. Distinguishable
from "yet another blue-accent dark theme." Engine/tool-like without being flashy.

---

## Sample 7: "Graphite" (Warm Neutral + Green Accent)

**Personality:** Earthy, grounded, calm. Inspired by nature-themed dev tools.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #101010  ████████████████  True dark        │
│  Surface    #1a1a18  ████████████████  Warm graphite    │
│  Raised     #252522  ████████████████  Olive-gray       │
│  Border     #363632  ████████████████  Stone            │
│  Text       #e8e6e1  ████████████████  Parchment white  │
│  Muted      #85837c  ████████████████  Warm stone       │
│                                                         │
│  Accent     #22c55e  ████████████████  Vivid green      │
│  Success    #22c55e  ████████████████  (same as accent) │
│  Warning    #eab308  ████████████████  Gold             │
│  Danger     #ef4444  ████████████████  Red              │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #22c55e bg │  │  #363632 bdr│  │  #ef4444 bg │  │
│  │  #101010 txt│  │  #e8e6e1 txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  Note: Accent = Success is a problem. Primary actions │
│  and success states become visually indistinguishable.│
└──────────────────────────────────────────────────────┘
```

**Character:** Organic, different. BUT: green accent colliding with success
state is a real usability issue. Would need a secondary accent (e.g., blue) to
differentiate primary actions from success feedback.

---

## Sample 8: "Void" (Ultra-Minimal OLED)

**Personality:** Maximum contrast. True black backgrounds for OLED friendliness.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #000000  ████████████████  True black       │
│  Surface    #0a0a0a  ████████████████  Near-black       │
│  Raised     #161616  ████████████████  Barely visible   │
│  Border     #2a2a2a  ████████████████  Subtle edge      │
│  Text       #fafafa  ████████████████  Pure white       │
│  Muted      #666666  ████████████████  Mid gray         │
│                                                         │
│  Accent     #3b82f6  ████████████████  Standard blue    │
│  Success    #22c55e  ████████████████  Green            │
│  Warning    #f59e0b  ████████████████  Amber            │
│  Danger     #ef4444  ████████████████  Red              │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #3b82f6 bg │  │  #2a2a2a bdr│  │  #ef4444 bg │  │
│  │  white text │  │  #fafafa txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #0a0a0a bg, #2a2a2a border, 6px radius │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Note: Surfaces barely differentiate from bg.        │
│  Relies almost entirely on borders for separation.   │
│  Clean but can feel flat / lacking depth.            │
└──────────────────────────────────────────────────────┘
```

**Character:** Dramatic. Maximum content focus. But limited surface
differentiation makes complex layouts (panels within panels) harder to parse.

---

## Sample 9: "Amethyst" (Purple-shifted Dark)

**Personality:** Distinctive, creative-tool energy. Think Figma-meets-gaming.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #0e0b13  ████████████████  Deep plum-black  │
│  Surface    #191422  ████████████████  Dark purple-gray │
│  Raised     #241e30  ████████████████  Muted violet     │
│  Border     #352e42  ████████████████  Dusty purple     │
│  Text       #e8e4ef  ████████████████  Lavender white   │
│  Muted      #8a8298  ████████████████  Mauve            │
│                                                         │
│  Accent     #c084fc  ████████████████  Bright purple    │
│  Success    #4ade80  ████████████████  Mint             │
│  Warning    #fbbf24  ████████████████  Amber            │
│  Danger     #fb7185  ████████████████  Rose red         │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #c084fc bg │  │  #352e42 bdr│  │  #fb7185 bg │  │
│  │  #0e0b13 txt│  │  #e8e4ef txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #191422 bg, #352e42 border, 8px radius │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Badges: 8px radius, tinted purple fills             │
│  ┌─ Active ─┐  ┌── Draft ──┐  ┌── Error ──┐         │
│  │ #4ade80  │  │ #fbbf24   │  │ #fb7185   │         │
│  └──────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
```

**Character:** Bold identity. Purple is polarizing — some love it, some find
it distracting. Works well if you want ForgeUI to have instant brand recognition.

---

## Sample 10: "Midnight Forge v2" (Hybrid — Navy + Warm Accents)

**Personality:** Combines the navy professionalism of Sample 1 with warmer
accent tones from Sample 3. Feels purposeful and distinctive.

```
┌─────────────────────────────────────────────────────────┐
│  BG         #080c14  ████████████████  Deep ink         │
│  Surface    #101828  ████████████████  Navy             │
│  Raised     #1a2540  ████████████████  Steel blue       │
│  Border     #283650  ████████████████  Blue edge        │
│  Text       #e2e8f0  ████████████████  Slate white      │
│  Muted      #7889a4  ████████████████  Dusty blue       │
│                                                         │
│  Accent     #f59e0b  ████████████████  Amber/Gold       │
│  Success    #34d399  ████████████████  Emerald          │
│  Warning    #fb923c  ████████████████  Orange           │
│  Danger     #f87171  ████████████████  Coral red        │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  ● Save     │  │  ○ Cancel   │  │  ◌ Delete   │  │
│  │  #f59e0b bg │  │  #283650 bdr│  │  #f87171 bg │  │
│  │  #080c14 txt│  │  #e2e8f0 txt│  │  white text │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │  Entity Name                        ▼   │        │
│  │  ──────────────────────────────────────  │        │
│  │  #101828 bg, #283650 border, 6px radius │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  Badges: 6px radius, semitransparent fills           │
│  ┌─ Active ─┐  ┌── Draft ──┐  ┌── Error ──┐         │
│  │ #34d399  │  │ #f59e0b   │  │ #f87171   │         │
│  │ 20% bg   │  │ 20% bg    │  │ 20% bg    │         │
│  └──────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
```

**Character:** The "forge" gold accent on navy creates strong brand identity.
Warm accent against cool base provides excellent visual hierarchy. The amber
primary action button immediately draws the eye without competing with status
colors.

---

## Comparison Matrix

| #   | Name              | Base Tone        | Accent | Radius | Risk                                              |
| --- | ----------------- | ---------------- | ------ | ------ | ------------------------------------------------- |
| 1   | Midnight Forge    | Navy             | Blue   | 6px    | Safe/generic — could be any IDE                   |
| 2   | Obsidian          | Neutral          | Violet | 4px    | Minimal; purple may not feel "game dev"           |
| 3   | Ember             | Warm brown       | Amber  | 6-8px  | Thematic but can feel muddy                       |
| 4   | Neon Terminal     | Dark blue        | Cyan   | 2px    | Eye fatigue in long sessions                      |
| 5   | Slate             | Cool gray-purple | Indigo | 8px    | Too subtle for status indicators                  |
| 6   | Deep Space        | Dark blue        | Teal   | 6px    | Strong identity; distinct from blue-accent themes |
| 7   | Graphite          | Warm neutral     | Green  | 6px    | Accent = Success collision                        |
| 8   | Void              | True black       | Blue   | 6px    | Flat, poor surface differentiation                |
| 9   | Amethyst          | Purple           | Purple | 8px    | Polarizing; strong brand or strong rejection      |
| 10  | Midnight Forge v2 | Navy             | Amber  | 6px    | Gold-on-navy = high identity; warm+cool balance   |

## Design Language Variables Beyond Color

Each palette implies different decisions about:

| Decision            | Options shown above                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------- |
| **Border radius**   | 2px (sharp/technical), 4px (precise), 6px (balanced), 8px (soft/friendly)                 |
| **Badge style**     | Solid fill, semitransparent fill (15-20% opacity), outline-only, pill vs rounded-rect     |
| **Button variants** | Filled primary, border-only secondary, ghost (text-only) danger vs filled danger          |
| **Elevation model** | Shadows (Samples 1,3,5), borders only (8), glow effects (4), color differentiation (most) |
| **Input focus**     | Ring outline (most), glow (4), color border shift                                         |

## Recommendation

**Samples 1, 6, and 10** form the strongest shortlist for a game dev tool suite:

- **1 (Midnight Forge)** if you want safe, professional, and familiar.
- **6 (Deep Space)** if you want distinct without being divisive — teal accent is uncommon and memorable.
- **10 (Midnight Forge v2)** if you want the strongest "ForgeUI" brand identity — amber/gold on navy literally evokes a forge.

Pick 1–3 favorites and I'll refine the full token scale for those.
