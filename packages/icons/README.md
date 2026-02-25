# @forgeui/icons

Curated icon set for ForgeUI — a named subset of Lucide React plus 10 custom game development icons.

## Installation

```bash
npm install @forgeui/icons
```

Requires React 19+ as a peer dependency.

## Usage

```tsx
import { SaveIcon, NodeIcon, TimelineIcon, ChevronDownIcon } from '@forgeui/icons'

// Default size is 24; color defaults to 'currentColor'
<SaveIcon />

// Custom size and color
<NodeIcon size={20} color="var(--forge-accent)" />
<TimelineIcon size={16} color="var(--forge-text-muted)" />
```

All icons accept `size` (number, default `24`) and `color` (string, default `'currentColor'`) props and render in a square bounding box.

## Custom game development icons

10 icons built specifically for game development tooling:

| Component | Use case |
|-----------|----------|
| `NodeIcon` | NodeEditor nodes, shader graph nodes |
| `EdgeIcon` | NodeEditor connections/edges |
| `TimelineIcon` | Animation timeline, cutscene editor |
| `SceneGraphIcon` | Scene hierarchy, entity tree |
| `EntityIcon` | Entity list, inspector header |
| `ComponentIcon` | Entity component system, ECS views |
| `SplineIcon` | Curve editors, path tools |
| `VertexIcon` | Mesh editing, vertex selection |
| `TerrainIcon` | Terrain tool, heightmap editor |
| `NavMeshIcon` | Navigation mesh, pathfinding tools |

## Lucide subset

A curated subset of Lucide React is re-exported with an `Icon` suffix for naming consistency and reliable tree-shaking. Import only what you use:

```tsx
import {
  // Navigation & direction
  ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, ChevronUpIcon,
  ArrowLeftIcon, ArrowRightIcon,

  // File & data actions
  SaveIcon, CopyIcon, TrashIcon, EditIcon,
  DownloadIcon, UploadIcon, ExternalLinkIcon,

  // Editing actions
  UndoIcon, RedoIcon, PlusIcon, CloseIcon,

  // Search & filter
  SearchIcon, FilterIcon, SortAscIcon, SortDescIcon,

  // UI controls
  MenuIcon, SidebarIcon, SettingsIcon,
  GridIcon, ListIcon, LayersIcon,

  // Media playback
  PlayIcon, PauseIcon, StopIcon,

  // Status & feedback
  InfoIcon, CheckIcon, WarningIcon,
  AlertCircleIcon, CheckCircleIcon, XCircleIcon,

  // State indicators
  RefreshIcon,
} from '@forgeui/icons'
```

## Icon sizes

Match the ForgeUI icon size tokens for visual consistency across components:

| Size | Token | Use |
|------|-------|-----|
| `14` | `--forge-icon-xs` | Inline metadata, badge decorations |
| `16` | `--forge-icon-sm` | Button icons, form field adornments |
| `20` | `--forge-icon-md` | Default standalone icons, nav items |
| `24` | `--forge-icon-lg` | Page headers, empty state illustrations |

```tsx
// Matching button icon size
<Button startIcon={<SaveIcon size={16} />}>Save</Button>

// Nav item icon
<NavItem icon={<LayersIcon size={20} />} label="Layers" />

// Page header
<PageHeader icon={<EntityIcon size={24} />} title="Entities" />
```

## IconProps type

```ts
import type { IconProps } from '@forgeui/icons'

interface IconProps {
  size?: number   // width and height in px; default 24
  color?: string  // CSS color string; default 'currentColor'
}
```
