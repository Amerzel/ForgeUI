/**
 * @forgeui/icons
 *
 * Curated icon set for ForgeUI. Re-exports a named subset of Lucide React icons
 * relevant to game development tooling, plus custom SVG icons unique to the
 * ForgeUI ecosystem.
 *
 * All icons accept `size` (number, default 20) and `color` (string, default
 * 'currentColor') props, plus any standard SVG props. Square bounding box
 * guaranteed — do not override width/height independently.
 *
 * Import named icons:
 *   import { ChevronDownIcon, NodeIcon } from '@forgeui/icons'
 */

// ---------------------------------------------------------------------------
// Re-exported Lucide icons (named with Icon suffix for clarity)
// ---------------------------------------------------------------------------

// Navigation & UI chrome
export {
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronUp as ChevronUpIcon,
  ChevronsUpDown as ChevronsUpDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowUpDown as ArrowUpDownIcon,
  MoreHorizontal as MoreHorizontalIcon,
  MoreVertical as MoreVerticalIcon,
  Menu as MenuIcon,
  X as XIcon,
  Check as CheckIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
} from 'lucide-react'

// Actions
export {
  Search as SearchIcon,
  Filter as FilterIcon,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
  Copy as CopyIcon,
  Clipboard as ClipboardIcon,
  Scissors as ScissorsIcon,
  Trash2 as TrashIcon,
  Trash as TrashAltIcon,
  Edit2 as EditIcon,
  Edit3 as EditAltIcon,
  Pencil as PencilIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FolderOpen as FolderOpenIcon,
  Folder as FolderIcon,
  File as FileIcon,
  FileText as FileTextIcon,
  RefreshCw as RefreshIcon,
  RotateCcw as UndoIcon,
  RotateCw as RedoIcon,
  Undo2 as Undo2Icon,
  Redo2 as Redo2Icon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Maximize2 as MaximizeIcon,
  Minimize2 as MinimizeIcon,
  Move as MoveIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  ExternalLink as ExternalLinkIcon,
} from 'lucide-react'

// Status & feedback
export {
  Info as InfoIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle2 as CheckCircleIcon,
  XCircle as XCircleIcon,
  HelpCircle as HelpCircleIcon,
  Loader2 as LoaderIcon,
  Clock as ClockIcon,
} from 'lucide-react'

// Layout & panels
export {
  PanelLeft as PanelLeftIcon,
  PanelRight as PanelRightIcon,
  PanelBottom as PanelBottomIcon,
  Sidebar as SidebarIcon,
  Layout as LayoutIcon,
  Grid as GridIcon,
  Grid3x3 as Grid3Icon,
  Columns as ColumnsIcon,
  Rows as RowsIcon,
  SplitSquareHorizontal as SplitHorizontalIcon,
  SplitSquareVertical as SplitVerticalIcon,
} from 'lucide-react'

// Game dev — general
export {
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as StopIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Rewind as RewindIcon,
  FastForward as FastForwardIcon,
  Settings as SettingsIcon,
  Settings2 as Settings2Icon,
  Sliders as SlidersIcon,
  SlidersHorizontal as SlidersHorizontalIcon,
  Tag as TagIcon,
  Tags as TagsIcon,
  Layers as LayersIcon,
  Box as BoxIcon,
  Boxes as BoxesIcon,
  Package as PackageIcon,
  Globe as GlobeIcon,
  Map as MapIcon,
  MapPin as MapPinIcon,
  Compass as CompassIcon,
  Mountain as MountainIcon,
  TreePine as TreeIcon,
  Waves as WavesIcon,
  Wind as WindIcon,
  Flame as FlameIcon,
  Zap as ZapIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Shield as ShieldIcon,
  Sword as SwordIcon,
  Target as TargetIcon,
  Crosshair as CrosshairIcon,
  Gamepad2 as GamepadIcon,
  Cpu as CpuIcon,
  Terminal as TerminalIcon,
  Code as CodeIcon,
  Code2 as Code2Icon,
  Braces as BracesIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Network as NetworkIcon,
  Workflow as WorkflowIcon,
  GitBranch as GitBranchIcon,
  GitMerge as GitMergeIcon,
  GitCommit as GitCommitIcon,
  Share2 as ShareIcon,
  Shuffle as ShuffleIcon,
  Repeat as RepeatIcon,
} from 'lucide-react'

// Typography & content
export {
  Type as TypeIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Hash as HashIcon,
  AtSign as AtSignIcon,
} from 'lucide-react'

// Colors & visual
export {
  Palette as PaletteIcon,
  Pipette as EyeDropperIcon,
  Paintbrush as PaintbrushIcon,
  PenTool as PenToolIcon,
  Eraser as EraserIcon,
  ImageIcon,
  Image as ImageAltIcon,
  Camera as CameraIcon,
  Video as VideoIcon,
  Aperture as ApertureIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Contrast as ContrastIcon,
} from 'lucide-react'

// Keyboard & input
export {
  Keyboard as KeyboardIcon,
  Mouse as MouseIcon,
  Command as CommandIcon,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Custom game-development SVG icons
// ---------------------------------------------------------------------------

export { NodeIcon } from './custom/NodeIcon.js'
export { EdgeIcon } from './custom/EdgeIcon.js'
export { TimelineIcon } from './custom/TimelineIcon.js'
export { SceneGraphIcon } from './custom/SceneGraphIcon.js'
export { EntityIcon } from './custom/EntityIcon.js'
export { ComponentIcon } from './custom/ComponentIcon.js'
export { SplineIcon } from './custom/SplineIcon.js'
export { VertexIcon } from './custom/VertexIcon.js'
export { TerrainIcon } from './custom/TerrainIcon.js'
export { NavMeshIcon } from './custom/NavMeshIcon.js'

// ---------------------------------------------------------------------------
// Shared icon props type (re-exported for consumers)
// ---------------------------------------------------------------------------

export type { IconProps } from './types.js'
