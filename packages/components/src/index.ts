/**
 * @forgeui/components
 *
 * ForgeUI component library barrel export.
 * For CSS-optimal builds, prefer deep imports:
 *   import { Button } from '@forgeui/components/Button'
 *
 * Barrel imports pull all component CSS — fine for prototyping,
 * use deep imports in production for optimal bundle size.
 */

// Provider
export { ThemeProvider } from './ThemeProvider/index.js'
export type { ThemeProviderProps } from './ThemeProvider/index.js'

// Layout primitives
export { Box } from './layout/Box.js'
export type { BoxProps } from './layout/Box.js'
export { Stack } from './layout/Stack.js'
export type { StackProps } from './layout/Stack.js'
export { Flex } from './layout/Flex.js'
export type { FlexProps } from './layout/Flex.js'
export { Group } from './layout/Group.js'
export type { GroupProps } from './layout/Group.js'
export { Grid } from './layout/Grid.js'
export type { GridProps, GridColProps } from './layout/Grid.js'
export { Center } from './layout/Center.js'
export type { CenterProps } from './layout/Center.js'
export { Spacer } from './layout/Spacer.js'
export type { SpacerProps } from './layout/Spacer.js'
export { Container } from './layout/Container.js'
export type { ContainerProps } from './layout/Container.js'
export { SimpleGrid } from './layout/SimpleGrid.js'
export type { SimpleGridProps } from './layout/SimpleGrid.js'
export { Wrap } from './layout/Wrap.js'
export type { WrapProps } from './layout/Wrap.js'

// Phase 1 — Overlays
export { Dialog } from './overlays/Dialog.js'
export { Tooltip, TooltipProvider, type TooltipProps } from './overlays/Tooltip.js'
export { DropdownMenu } from './overlays/DropdownMenu.js'
export { ContextMenu } from './overlays/ContextMenu.js'
export { Popover } from './overlays/Popover.js'
export type {
  MenuEntry,
  MenuItem,
  MenuSeparatorItem,
  MenuSubItem,
  MenuItemVariant,
} from './overlays/Menu.js'

// Phase 1 — Feedback
export { Alert } from './feedback/Alert.js'
export { Progress } from './feedback/Progress.js'
export { Skeleton } from './feedback/Skeleton.js'
export { ToastProvider, ToastList } from './feedback/Toast.js'
export type { ToastItem, ToastVariant } from './feedback/Toast.js'
export { EmptyState } from './feedback/EmptyState.js'
export type { EmptyStateProps, EmptyStateAction } from './feedback/EmptyState.js'

// Phase 1 — Disclosure
export { Accordion } from './disclosure/Accordion.js'
export { Tabs } from './disclosure/Tabs.js'

// Phase 1 — Forms
export { Input } from './forms/Input.js'
export { Textarea } from './forms/Textarea.js'
export { Select } from './forms/Select.js'
export { Checkbox } from './forms/Checkbox.js'
export { Switch } from './forms/Switch.js'
export { RadioGroup } from './forms/RadioGroup.js'
export { Slider } from './forms/Slider.js'
export { Toggle } from './forms/Toggle.js'
export { ToggleGroup } from './forms/ToggleGroup.js'
export { FormField } from './forms/FormField.js'
export { NumberInput } from './forms/NumberInput.js'

// Phase 3 — Domain-specific
export { NodeEditor } from './domain/NodeEditor.js'
export type { FlowNode, FlowEdge } from './domain/NodeEditor.js'
export { Timeline } from './domain/Timeline.js'
export type { TimelineTrack, TimelineClip } from './domain/Timeline.js'
export { VirtualCanvas } from './domain/VirtualCanvas.js'
export type { CanvasViewport, CanvasItem } from './domain/VirtualCanvas.js'
export { DrawingCanvas } from './domain/DrawingCanvas.js'
export type { DrawingCanvasProps } from './domain/DrawingCanvas.js'
export { ImageViewer } from './domain/ImageViewer.js'
export type { ImageViewerProps } from './domain/ImageViewer.js'
export { ComparisonSlider } from './domain/ComparisonSlider.js'
export type { ComparisonSliderProps } from './domain/ComparisonSlider.js'
export { LayerStack } from './domain/LayerStack.js'
export type { Layer, LayerStackProps } from './domain/LayerStack.js'
export { AnimationPreview } from './domain/AnimationPreview.js'
export type { AnimationFrame, AnimationPreviewProps } from './domain/AnimationPreview.js'
export { TilePreview } from './domain/TilePreview.js'
export type { TilePreviewProps, TileSource } from './domain/TilePreview.js'
export { TilingGrid } from './domain/TilingGrid.js'
export type { TilingGridProps } from './domain/TilingGrid.js'
export { PipelineStepViewer } from './domain/PipelineStepViewer.js'
export type { PipelineStepViewerProps, PipelineStep } from './domain/PipelineStepViewer.js'
export { HeatMapOverlay, renderHeatMap } from './domain/HeatMapOverlay.js'
export type {
  HeatMapOverlayProps,
  HeatMapColorMap,
  RenderHeatMapOptions,
} from './domain/HeatMapOverlay.js'
export { VerdictWidget } from './domain/VerdictWidget.js'
export type { VerdictWidgetProps, Verdict } from './domain/VerdictWidget.js'
export { GenerationQueue } from './domain/GenerationQueue.js'
export type { GenerationQueueProps, GenerationJob } from './domain/GenerationQueue.js'
export { WizardDialog } from './domain/WizardDialog.js'
export type { WizardDialogProps, WizardStep } from './domain/WizardDialog.js'

// Phase 2b — Complex inputs
export { DataTable } from './complex/DataTable.js'
export type { ColumnDef } from './complex/DataTable.js'
export { CommandPalette } from './complex/CommandPalette.js'
export type { CommandGroup, CommandItem } from './complex/CommandPalette.js'
export { TreeView } from './complex/TreeView.js'
export type { TreeNode } from './complex/TreeView.js'
export { Combobox } from './complex/Combobox.js'
export type { ComboboxOption } from './complex/Combobox.js'
export { ColorPicker } from './complex/ColorPicker.js'
export { TagsInput } from './complex/TagsInput.js'
export { PropertyGrid } from './complex/PropertyGrid.js'
export type {
  PropertySection,
  PropertyItem,
  PropertyType,
  SelectOption,
} from './complex/PropertyGrid.js'
export { EditableText } from './complex/EditableText.js'
export { DiffViewer } from './complex/DiffViewer.js'
export type { DiffViewerProps, DiffLine } from './complex/DiffViewer.js'
export { FilterBar } from './complex/FilterBar.js'
export type {
  FilterBarProps,
  FilterDefinition,
  FilterOption,
  FilterState,
} from './complex/FilterBar.js'
export { CodeBlock } from './complex/CodeBlock.js'
export type { CodeBlockProps } from './complex/CodeBlock.js'
export { JsonViewer } from './complex/JsonViewer.js'
export type { JsonViewerProps } from './complex/JsonViewer.js'

// Phase 2a — Layout
export { AppShell } from './layout/AppShell.js'
export { ResizablePanel, ResizablePanelGroup } from './layout/ResizablePanelGroup.js'
export { Table } from './layout/Table.js'
export { DropZone } from './layout/DropZone.js'
export { Pagination } from './layout/Pagination.js'

// Phase 2a — Composites
export { Drawer } from './composites/Drawer.js'
export { Collapsible } from './composites/Collapsible.js'
export { Toolbar } from './composites/Toolbar.js'
export { Steps } from './composites/Steps.js'
export type { Step } from './composites/Steps.js'
export { Avatar } from './composites/Avatar.js'
export { AspectRatio } from './composites/AspectRatio.js'
export { Breadcrumb } from './composites/Breadcrumb.js'
export type { BreadcrumbItem } from './composites/Breadcrumb.js'
export { Menubar } from './composites/Menubar.js'
export type { MenubarMenu } from './composites/Menubar.js'
export { StatCard } from './composites/StatCard.js'
export type { StatCardProps, StatCardColor } from './composites/StatCard.js'
export { HealthRow } from './composites/HealthRow.js'
export type { HealthRowProps, HealthStatus } from './composites/HealthRow.js'
export { NavItem } from './composites/NavItem.js'
export type { NavItemProps } from './composites/NavItem.js'
export { ModuleToolbar } from './composites/ModuleToolbar.js'
export type { ModuleToolbarProps } from './composites/ModuleToolbar.js'
export { EntityCard } from './composites/EntityCard.js'
export type { EntityCardProps } from './composites/EntityCard.js'
export { MiniMap } from './composites/MiniMap.js'
export type { MiniMapProps, MiniMapViewport } from './composites/MiniMap.js'
export { ApprovalPanel } from './composites/ApprovalPanel.js'
export type { ApprovalPanelProps } from './composites/ApprovalPanel.js'
export { FileSourceBar } from './composites/FileSourceBar.js'
export type { FileSourceBarProps, FileSourceBarFile } from './composites/FileSourceBar.js'

// Phase 1 — Primitives
export { VisuallyHidden } from './primitives/VisuallyHidden.js'
export { Label } from './primitives/Label.js'
export { Separator } from './primitives/Separator.js'
export { Spinner } from './primitives/Spinner.js'
export { Badge } from './primitives/Badge.js'
export { Text } from './primitives/Text.js'
export { Heading } from './primitives/Heading.js'
export { Kbd } from './primitives/Kbd.js'
export { ScrollArea } from './primitives/ScrollArea.js'
export { Card } from './primitives/Card.js'
export { Button } from './primitives/Button.js'
export { IconButton } from './primitives/IconButton.js'
export { AlertDialog } from './primitives/AlertDialog.js'
export { SectionHeader } from './primitives/SectionHeader.js'
export type { SectionHeaderProps } from './primitives/SectionHeader.js'
