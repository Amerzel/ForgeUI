import type { Meta, StoryObj } from '@storybook/react'
import {
  Box,
  Stack,
  Flex,
  Group,
  Grid,
  Center,
  Spacer,
  Container,
  SimpleGrid,
  Wrap,
  Button,
  Badge,
  Text,
  Heading,
  Separator,
  Card,
  Input,
  Select,
  Tabs,
  Spinner,
} from '@forgeui/components'

/**
 * Real-world game dev tool layout compositions.
 *
 * These stories show how to combine ForgeUI layout primitives to build
 * complete, realistic UI shells — the kinds of layouts you'd find in
 * LoreEngine, AssetGenerator, PipelineInspector, or any similar tool.
 *
 * Each story is a self-contained, interactive mockup. Read the source
 * to see exactly which primitives produce each region.
 */
const meta: Meta = {
  title: 'Patterns/Game Dev Compositions',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared swatch helpers
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      size="xs"
      color="muted"
      style={{
        fontFamily: 'var(--forge-font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </Text>
  )
}

function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <Card>
      <Card.Body>
        <Stack gap={1}>
          <Text size="xs" color="muted">
            {label}
          </Text>
          <Flex align="baseline" gap={2}>
            <Text size="lg" weight="semibold">
              {value}
            </Text>
            {delta && (
              <Badge color={delta.startsWith('+') ? 'success' : 'danger'} variant="subtle">
                {delta}
              </Badge>
            )}
          </Flex>
        </Stack>
      </Card.Body>
    </Card>
  )
}

function TreeItem({
  label,
  depth = 0,
  active = false,
  icon = '◆',
}: {
  label: string
  depth?: number
  active?: boolean
  icon?: string
}) {
  return (
    <Box
      p={2}
      radius="sm"
      style={{
        paddingLeft: `calc(var(--forge-space-2) + ${depth * 16}px)`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: active ? 'var(--forge-accent)' : undefined,
      }}
    >
      <Text size="xs" style={{ opacity: 0.5, fontFamily: 'var(--forge-font-mono)' }}>
        {icon}
      </Text>
      <Text
        size="sm"
        style={{ color: active ? 'var(--forge-text-on-accent)' : 'var(--forge-text)' }}
      >
        {label}
      </Text>
    </Box>
  )
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex
      justify="space-between"
      align="center"
      py={1}
      style={{ borderBottom: '1px solid var(--forge-border-subtle)' }}
    >
      <Text size="xs" color="muted" style={{ minWidth: 100 }}>
        {label}
      </Text>
      <Text size="xs" weight="medium" style={{ fontFamily: 'var(--forge-font-mono)' }}>
        {value}
      </Text>
    </Flex>
  )
}

function LogLine({
  level,
  message,
  ts,
}: {
  level: 'info' | 'warn' | 'error' | 'ok'
  message: string
  ts: string
}) {
  const color = {
    info: 'var(--forge-text-muted)',
    warn: 'var(--forge-warning)',
    error: 'var(--forge-danger)',
    ok: 'var(--forge-success)',
  }[level]
  const prefix = { info: 'INFO', warn: 'WARN', error: 'ERR ', ok: ' OK ' }[level]
  return (
    <Flex
      gap={3}
      style={{
        fontFamily: 'var(--forge-font-mono)',
        fontSize: 'var(--forge-font-size-xs)',
        whiteSpace: 'nowrap',
      }}
    >
      <Text size="xs" color="muted" style={{ minWidth: 52, flexShrink: 0 }}>
        {ts}
      </Text>
      <Text size="xs" style={{ color, minWidth: 36, flexShrink: 0 }}>
        {prefix}
      </Text>
      <Text size="xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {message}
      </Text>
    </Flex>
  )
}

// ---------------------------------------------------------------------------
// 1. Three-panel editor shell (sidebar + canvas + inspector)
// ---------------------------------------------------------------------------
export const ThreePanelEditor: Story = {
  name: 'Three-panel Editor Shell',
  render: () => (
    <Grid columns="220px 1fr 280px" style={{ height: '100vh' }}>
      {/* ── Sidebar ── */}
      <Stack
        gap={0}
        bg="surface"
        style={{ borderRight: '1px solid var(--forge-border)', overflow: 'hidden' }}
      >
        {/* Sidebar header */}
        <Box p={3} style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Flex align="center" gap={2}>
            <Badge color="accent" variant="solid" style={{ fontFamily: 'var(--forge-font-mono)' }}>
              LE
            </Badge>
            <Text size="sm" weight="semibold">
              LoreEngine
            </Text>
          </Flex>
        </Box>

        {/* Project tree */}
        <Box p={2} style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap={0}>
            <Box px={2} py={1}>
              <SectionLabel>Worlds</SectionLabel>
            </Box>
            <TreeItem label="Eldenmoor" icon="🌍" active />
            <TreeItem label="Factions" depth={1} icon="⚔️" />
            <TreeItem label="Ironback Clan" depth={2} />
            <TreeItem label="Sunguard" depth={2} />
            <TreeItem label="Entities" depth={1} icon="👤" />
            <TreeItem label="Goblin Chief" depth={2} />
            <TreeItem label="Lady Aldra" depth={2} />
            <TreeItem label="Prophecies" depth={1} icon="📜" />
            <Separator style={{ margin: '8px 0' }} />
            <Box px={2} py={1}>
              <SectionLabel>Assets</SectionLabel>
            </Box>
            <TreeItem label="Character Art" icon="🎨" />
            <TreeItem label="World Maps" icon="🗺️" />
          </Stack>
        </Box>

        {/* Sidebar footer */}
        <Box p={2} style={{ borderTop: '1px solid var(--forge-border)' }}>
          <Group gap={1}>
            <Button size="sm" variant="ghost" style={{ flex: 1 }}>
              + World
            </Button>
            <Button size="sm" variant="ghost" style={{ flex: 1 }}>
              + Entity
            </Button>
          </Group>
        </Box>
      </Stack>

      {/* ── Canvas / Main ── */}
      <Stack gap={0} style={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box px={3} py={2} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Group gap={2}>
            <Heading level={4} size="sm">
              Goblin Chief
            </Heading>
            <Badge color="warning" variant="subtle">
              Draft
            </Badge>
            <Spacer />
            <Button size="sm" variant="ghost">
              Duplicate
            </Button>
            <Button size="sm" variant="ghost">
              History
            </Button>
            <Separator orientation="vertical" style={{ height: 20 }} />
            <Button size="sm" variant="primary">
              Save
            </Button>
          </Group>
        </Box>

        {/* Content */}
        <Box p={4} style={{ flex: 1, overflowY: 'auto' }}>
          <Container size="md">
            <Stack gap={5}>
              <SimpleGrid cols={3} spacing={3}>
                <StatCard label="Health" value="85" delta="+5" />
                <StatCard label="Level" value="12" />
                <StatCard label="Faction" value="Ironback" />
              </SimpleGrid>

              <Tabs
                defaultValue="lore"
                items={[
                  {
                    value: 'lore',
                    label: 'Lore',
                    content: (
                      <Stack gap={3}>
                        <Text color="muted" size="sm">
                          Krag the Ironback leads the largest goblin clan in Eldenmoor&apos;s
                          eastern marshes. Born from the ashes of the Sunguard conflict, he has
                          united three rival clans under a single banner through fear, cunning, and
                          an unnatural resistance to fire.
                        </Text>
                        <Wrap gap={2}>
                          {[
                            'Aggressive',
                            'Pack Leader',
                            'Fire Resistant',
                            'Cursed',
                            'Legendary',
                          ].map((t) => (
                            <Badge key={t} variant="subtle" color="warning">
                              {t}
                            </Badge>
                          ))}
                        </Wrap>
                      </Stack>
                    ),
                  },
                  {
                    value: 'stats',
                    label: 'Stats',
                    content: (
                      <Text color="muted" size="sm">
                        Stats editor here…
                      </Text>
                    ),
                  },
                  {
                    value: 'relations',
                    label: 'Relations',
                    content: (
                      <Text color="muted" size="sm">
                        Relations graph here…
                      </Text>
                    ),
                  },
                  {
                    value: 'events',
                    label: 'Events',
                    content: (
                      <Text color="muted" size="sm">
                        Event log here…
                      </Text>
                    ),
                  },
                ]}
              />
            </Stack>
          </Container>
        </Box>
      </Stack>

      {/* ── Inspector ── */}
      <Stack
        gap={0}
        bg="surface"
        style={{ borderLeft: '1px solid var(--forge-border)', overflow: 'hidden' }}
      >
        <Box p={3} style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Text size="sm" weight="semibold">
            Inspector
          </Text>
        </Box>

        <Box p={3} style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap={4}>
            <Stack gap={2}>
              <SectionLabel>Identity</SectionLabel>
              <InspectorRow label="ID" value="entity-0042" />
              <InspectorRow label="Type" value="NPC" />
              <InspectorRow label="World" value="eldenmoor" />
              <InspectorRow label="Faction" value="ironback-clan" />
            </Stack>

            <Stack gap={2}>
              <SectionLabel>Behavior</SectionLabel>
              <InspectorRow label="AI Profile" value="aggressive" />
              <InspectorRow label="Alert Range" value="12.5u" />
              <InspectorRow label="Patrol" value="true" />
            </Stack>

            <Stack gap={2}>
              <SectionLabel>Spawn</SectionLabel>
              <InspectorRow label="Region" value="east-marsh" />
              <InspectorRow label="Max Count" value="1" />
              <InspectorRow label="Respawn" value="disabled" />
            </Stack>
          </Stack>
        </Box>

        <Box p={2} style={{ borderTop: '1px solid var(--forge-border)' }}>
          <Button size="sm" variant="danger" style={{ width: '100%' }}>
            Delete Entity
          </Button>
        </Box>
      </Stack>
    </Grid>
  ),
}

// ---------------------------------------------------------------------------
// 2. Dashboard — project overview with stat grid and activity feed
// ---------------------------------------------------------------------------
export const ProjectDashboard: Story = {
  name: 'Project Dashboard',
  render: () => (
    <Stack gap={0} style={{ minHeight: '100vh' }}>
      {/* Top bar */}
      <Box px={6} py={3} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
        <Group gap={3}>
          <Heading level={3} size="md">
            Eldenmoor — Project Overview
          </Heading>
          <Spacer />
          <Badge color="success" variant="subtle">
            Last built 2m ago
          </Badge>
          <Button size="sm" variant="primary">
            Build All
          </Button>
        </Group>
      </Box>

      <Box p={6} style={{ flex: 1, overflowY: 'auto' }}>
        <Stack gap={6}>
          {/* KPI row */}
          <SimpleGrid cols={4} spacing={3}>
            <StatCard label="Entities" value="142" delta="+3" />
            <StatCard label="Factions" value="7" />
            <StatCard label="Quests" value="38" delta="+1" />
            <StatCard label="Locations" value="64" delta="+2" />
          </SimpleGrid>

          {/* Two-column body */}
          <Grid columns="1fr 360px" gap={4}>
            {/* Recent activity */}
            <Card>
              <Card.Body>
                <Stack gap={3}>
                  <Flex align="center" gap={2}>
                    <Text weight="semibold">Recent Activity</Text>
                    <Spacer />
                    <Badge color="info" variant="subtle">
                      Live
                    </Badge>
                  </Flex>
                  <Separator />
                  {[
                    {
                      action: 'Entity created',
                      target: 'Goblin Chief',
                      ts: '2m ago',
                      color: 'success' as const,
                    },
                    {
                      action: 'Faction edited',
                      target: 'Ironback Clan',
                      ts: '15m ago',
                      color: 'info' as const,
                    },
                    {
                      action: 'Quest linked',
                      target: 'The Dark Forge',
                      ts: '1h ago',
                      color: 'accent' as const,
                    },
                    {
                      action: 'Build failed',
                      target: 'Asset pipeline',
                      ts: '2h ago',
                      color: 'danger' as const,
                    },
                    {
                      action: 'World exported',
                      target: 'eldenmoor.json',
                      ts: '3h ago',
                      color: 'neutral' as const,
                    },
                  ].map(({ action, target, ts, color }) => (
                    <Flex key={target} align="center" gap={3}>
                      <Badge
                        color={color}
                        variant="subtle"
                        style={{ minWidth: 8, height: 8, padding: 0, borderRadius: '50%' }}
                      >
                        {' '}
                      </Badge>
                      <Stack gap={0} style={{ flex: 1 }}>
                        <Text size="sm">
                          {action} — <strong>{target}</strong>
                        </Text>
                      </Stack>
                      <Text size="xs" color="muted">
                        {ts}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </Card.Body>
            </Card>

            {/* Build status */}
            <Stack gap={3}>
              <Card>
                <Card.Body>
                  <Stack gap={3}>
                    <Text weight="semibold">Pipeline Status</Text>
                    <Separator />
                    {[
                      { stage: 'Lore validation', status: 'ok' },
                      { stage: 'Asset generation', status: 'running' },
                      { stage: 'World export', status: 'pending' },
                      { stage: 'QA checks', status: 'pending' },
                    ].map(({ stage, status }) => (
                      <Flex key={stage} align="center" justify="space-between">
                        <Text size="sm">{stage}</Text>
                        {status === 'ok' && (
                          <Badge color="success" variant="subtle">
                            Done
                          </Badge>
                        )}
                        {status === 'running' && (
                          <Group gap={1}>
                            <Spinner size="sm" />
                            <Badge color="info" variant="subtle">
                              Running
                            </Badge>
                          </Group>
                        )}
                        {status === 'pending' && (
                          <Badge color="neutral" variant="subtle">
                            Pending
                          </Badge>
                        )}
                      </Flex>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Stack gap={2}>
                    <Text weight="semibold">Quick Actions</Text>
                    <Separator />
                    <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>
                      + New Entity
                    </Button>
                    <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>
                      + New Faction
                    </Button>
                    <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>
                      Run Validation
                    </Button>
                    <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>
                      Export World
                    </Button>
                  </Stack>
                </Card.Body>
              </Card>
            </Stack>
          </Grid>
        </Stack>
      </Box>
    </Stack>
  ),
}

// ---------------------------------------------------------------------------
// 3. Build / pipeline log viewer
// ---------------------------------------------------------------------------
export const PipelineLogViewer: Story = {
  name: 'Pipeline Log Viewer',
  render: () => (
    <Grid columns="260px 1fr" style={{ height: '100vh' }}>
      {/* Stage list */}
      <Stack gap={0} bg="surface" style={{ borderRight: '1px solid var(--forge-border)' }}>
        <Box p={3} style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Text size="sm" weight="semibold">
            Build #47
          </Text>
          <Text size="xs" color="muted">
            Started 3m 12s ago
          </Text>
        </Box>
        <Box p={2} style={{ flex: 1 }}>
          <Stack gap={1}>
            {[
              { name: 'Install deps', duration: '12s', status: 'ok' },
              { name: 'Typecheck', duration: '8s', status: 'ok' },
              { name: 'Lint', duration: '4s', status: 'ok' },
              { name: 'Unit tests', duration: '22s', status: 'ok' },
              { name: 'Asset generation', duration: '1m 4s', status: 'running' },
              { name: 'World export', duration: '—', status: 'pending' },
              { name: 'Bundle analysis', duration: '—', status: 'pending' },
            ].map(({ name, duration, status }) => (
              <Box
                key={name}
                p={2}
                radius="sm"
                style={{
                  cursor: 'pointer',
                  backgroundColor: status === 'running' ? 'var(--forge-surface-raised)' : undefined,
                }}
              >
                <Flex align="center" gap={2}>
                  <Box
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      flexShrink: 0,
                      backgroundColor:
                        status === 'ok'
                          ? 'var(--forge-success)'
                          : status === 'running'
                            ? 'var(--forge-info)'
                            : 'var(--forge-border)',
                    }}
                  />
                  <Text size="sm" style={{ flex: 1 }}>
                    {name}
                  </Text>
                  <Text size="xs" color="muted">
                    {duration}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Log output */}
      <Stack gap={0} style={{ overflow: 'hidden' }}>
        <Box px={4} py={2} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Group gap={2}>
            <Text size="sm" weight="semibold">
              Asset generation
            </Text>
            <Badge color="info" variant="solid">
              Running
            </Badge>
            <Spacer />
            <Button size="sm" variant="ghost">
              Copy
            </Button>
            <Button size="sm" variant="danger">
              Cancel
            </Button>
          </Group>
        </Box>

        <Box
          p={3}
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: 'var(--forge-surface)',
            fontFamily: 'var(--forge-font-mono)',
          }}
        >
          <Stack gap={1}>
            <LogLine level="info" ts="03:12" message="Starting asset generation pipeline…" />
            <LogLine level="info" ts="03:12" message="Found 142 entities in eldenmoor.json" />
            <LogLine
              level="info"
              ts="03:13"
              message="Processing faction: ironback-clan (38 assets)"
            />
            <LogLine
              level="ok"
              ts="03:13"
              message="ironback-clan/goblin-chief.png — generated (512×512)"
            />
            <LogLine
              level="ok"
              ts="03:13"
              message="ironback-clan/goblin-guard.png — generated (512×512)"
            />
            <LogLine
              level="warn"
              ts="03:13"
              message="ironback-clan/shaman.png — missing source texture, using fallback"
            />
            <LogLine level="info" ts="03:14" message="Processing faction: sunguard (24 assets)" />
            <LogLine
              level="ok"
              ts="03:14"
              message="sunguard/lady-aldra.png — generated (1024×1024)"
            />
            <LogLine
              level="info"
              ts="03:14"
              message="Processing faction: marsh-wraiths (17 assets)"
            />
            <LogLine
              level="error"
              ts="03:15"
              message="marsh-wraiths/wraith-elder.png — Error: source path not found: /assets/src/wraith-elder.psd"
            />
            <LogLine level="info" ts="03:15" message="Continuing with remaining assets…" />
            <LogLine level="info" ts="03:15" message="Processing locations: 64 discovered" />
            <Flex gap={2} align="center" pt={1}>
              <Spinner size="sm" />
              <Text size="xs" color="muted" style={{ fontFamily: 'var(--forge-font-mono)' }}>
                Generating east-marsh terrain tiles…
              </Text>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Grid>
  ),
}

// ---------------------------------------------------------------------------
// 4. Settings panel — multi-section form layout
// ---------------------------------------------------------------------------
export const SettingsPanel: Story = {
  name: 'Settings Panel',
  render: () => (
    <Grid columns="200px 1fr" style={{ height: '100vh' }}>
      {/* Settings nav */}
      <Stack gap={0} bg="surface" style={{ borderRight: '1px solid var(--forge-border)' }}>
        <Box p={3} style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Text size="sm" weight="semibold">
            Settings
          </Text>
        </Box>
        <Box p={2}>
          <Stack gap={0}>
            {[
              { label: 'General', active: true },
              { label: 'Appearance', active: false },
              { label: 'Asset Pipeline', active: false },
              { label: 'Export', active: false },
              { label: 'Keybindings', active: false },
              { label: 'About', active: false },
            ].map(({ label, active }) => (
              <Box
                key={label}
                px={3}
                py={2}
                radius="sm"
                style={{
                  cursor: 'pointer',
                  backgroundColor: active ? 'var(--forge-surface-raised)' : undefined,
                }}
              >
                <Text size="sm" weight={active ? 'medium' : 'normal'}>
                  {label}
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Settings content */}
      <Box p={6} style={{ overflowY: 'auto' }}>
        <Container size="sm">
          <Stack gap={8}>
            <Stack gap={1}>
              <Heading level={2} size="lg">
                General
              </Heading>
              <Text color="muted" size="sm">
                Project-wide settings and defaults.
              </Text>
            </Stack>

            {/* Section: Project */}
            <Stack gap={4}>
              <Stack gap={1}>
                <Text weight="semibold">Project</Text>
                <Separator />
              </Stack>
              <SimpleGrid cols={2} spacing={4}>
                <Stack gap={1}>
                  <Text size="sm">Project name</Text>
                  <Input defaultValue="Eldenmoor Chronicles" />
                </Stack>
                <Stack gap={1}>
                  <Text size="sm">Game engine</Text>
                  <Select
                    id="engine-select"
                    value="godot4"
                    options={[
                      { value: 'godot4', label: 'Godot 4' },
                      { value: 'unity', label: 'Unity' },
                      { value: 'unreal', label: 'Unreal Engine 5' },
                      { value: 'custom', label: 'Custom / Export only' },
                    ]}
                  />
                </Stack>
              </SimpleGrid>
              <Stack gap={1}>
                <Text size="sm">Project root</Text>
                <Group gap={2}>
                  <Input defaultValue="/home/james/dev/eldenmoor" style={{ flex: 1 }} readOnly />
                  <Button variant="ghost">Browse…</Button>
                </Group>
              </Stack>
            </Stack>

            {/* Section: Defaults */}
            <Stack gap={4}>
              <Stack gap={1}>
                <Text weight="semibold">Defaults</Text>
                <Separator />
              </Stack>
              <SimpleGrid cols={2} spacing={4}>
                <Stack gap={1}>
                  <Text size="sm">Default world</Text>
                  <Select
                    id="world-select"
                    value="eldenmoor"
                    options={[
                      { value: 'eldenmoor', label: 'Eldenmoor' },
                      { value: 'none', label: 'None (prompt on open)' },
                    ]}
                  />
                </Stack>
                <Stack gap={1}>
                  <Text size="sm">Entity ID format</Text>
                  <Select
                    id="id-format-select"
                    value="slug"
                    options={[
                      { value: 'slug', label: 'kebab-case slug' },
                      { value: 'uuid', label: 'UUID v4' },
                      { value: 'numeric', label: 'Numeric (auto-increment)' },
                    ]}
                  />
                </Stack>
              </SimpleGrid>
            </Stack>

            {/* Section: Danger zone */}
            <Stack gap={4}>
              <Stack gap={1}>
                <Text weight="semibold" style={{ color: 'var(--forge-danger)' }}>
                  Danger Zone
                </Text>
                <Separator />
              </Stack>
              <Card style={{ border: '1px solid var(--forge-danger-border)' }}>
                <Card.Body>
                  <Flex align="center" gap={3}>
                    <Stack gap={1} style={{ flex: 1 }}>
                      <Text size="sm" weight="semibold">
                        Reset all settings
                      </Text>
                      <Text size="xs" color="muted">
                        Revert to factory defaults. Your project data is not affected.
                      </Text>
                    </Stack>
                    <Button variant="danger" size="sm">
                      Reset
                    </Button>
                  </Flex>
                </Card.Body>
              </Card>
            </Stack>

            {/* Save bar */}
            <Flex justify="flex-end" gap={2}>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </Flex>
          </Stack>
        </Container>
      </Box>
    </Grid>
  ),
}

// ---------------------------------------------------------------------------
// 5. Asset browser — filterable grid layout
// ---------------------------------------------------------------------------
export const AssetBrowser: Story = {
  name: 'Asset Browser',
  render: () => {
    const assets = [
      {
        name: 'goblin-chief',
        type: 'Character',
        faction: 'Ironback',
        size: '512×512',
        status: 'ready',
      },
      {
        name: 'goblin-guard',
        type: 'Character',
        faction: 'Ironback',
        size: '512×512',
        status: 'ready',
      },
      {
        name: 'goblin-shaman',
        type: 'Character',
        faction: 'Ironback',
        size: '512×512',
        status: 'warn',
      },
      {
        name: 'lady-aldra',
        type: 'Character',
        faction: 'Sunguard',
        size: '1024×1024',
        status: 'ready',
      },
      {
        name: 'sunguard-helm',
        type: 'Item',
        faction: 'Sunguard',
        size: '256×256',
        status: 'ready',
      },
      { name: 'wraith-elder', type: 'Character', faction: 'Wraiths', size: '—', status: 'error' },
      { name: 'east-marsh', type: 'Location', faction: '—', size: '4096×4096', status: 'ready' },
      {
        name: 'iron-fortress',
        type: 'Location',
        faction: 'Ironback',
        size: '2048×2048',
        status: 'ready',
      },
    ]

    return (
      <Stack gap={0} style={{ height: '100vh' }}>
        {/* Toolbar */}
        <Box px={4} py={2} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Group gap={3}>
            <Heading level={3} size="sm">
              Asset Browser
            </Heading>
            <Separator orientation="vertical" style={{ height: 20 }} />
            <Input placeholder="Search assets…" style={{ width: 240 }} />
            <Box style={{ width: 140 }}>
              <Select
                id="type-filter"
                value="all"
                options={[
                  { value: 'all', label: 'All types' },
                  { value: 'character', label: 'Characters' },
                  { value: 'item', label: 'Items' },
                  { value: 'location', label: 'Locations' },
                ]}
              />
            </Box>
            <Box style={{ width: 140 }}>
              <Select
                id="faction-filter"
                value="all"
                options={[
                  { value: 'all', label: 'All factions' },
                  { value: 'ironback', label: 'Ironback Clan' },
                  { value: 'sunguard', label: 'Sunguard' },
                  { value: 'wraiths', label: 'Marsh Wraiths' },
                ]}
              />
            </Box>
            <Spacer />
            <Text size="sm" color="muted">
              {assets.length} assets
            </Text>
            <Button size="sm" variant="primary">
              Generate Selected
            </Button>
          </Group>
        </Box>

        {/* Filter chips */}
        <Box
          px={4}
          py={2}
          bg="surface-raised"
          style={{ borderBottom: '1px solid var(--forge-border)' }}
        >
          <Group gap={2}>
            <Text size="xs" color="muted">
              Active filters:
            </Text>
            <Wrap gap={2}>
              <Badge variant="subtle" color="accent">
                Type: Character ×
              </Badge>
              <Badge variant="subtle" color="info">
                Faction: Ironback ×
              </Badge>
            </Wrap>
            <Button size="sm" variant="ghost">
              Clear all
            </Button>
          </Group>
        </Box>

        {/* Asset grid */}
        <Box p={4} style={{ flex: 1, overflowY: 'auto' }}>
          <SimpleGrid minChildWidth="220px" spacing={3}>
            {assets.map((asset) => (
              <Card key={asset.name} style={{ cursor: 'pointer' }}>
                <Box
                  bg="surface-raised"
                  style={{
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--forge-radius-md) var(--forge-radius-md) 0 0',
                    fontSize: 40,
                  }}
                >
                  {asset.type === 'Character' ? '👤' : asset.type === 'Item' ? '⚔️' : '🗺️'}
                </Box>
                <Card.Body>
                  <Stack gap={1}>
                    <Flex align="center" gap={2}>
                      <Text
                        size="sm"
                        weight="medium"
                        style={{ flex: 1, fontFamily: 'var(--forge-font-mono)' }}
                      >
                        {asset.name}
                      </Text>
                      {asset.status === 'ready' && (
                        <Badge color="success" variant="subtle">
                          ✓
                        </Badge>
                      )}
                      {asset.status === 'warn' && (
                        <Badge color="warning" variant="subtle">
                          !
                        </Badge>
                      )}
                      {asset.status === 'error' && (
                        <Badge color="danger" variant="solid">
                          ✗
                        </Badge>
                      )}
                    </Flex>
                    <Flex gap={2} wrap="wrap">
                      <Badge color="neutral" variant="subtle">
                        {asset.type}
                      </Badge>
                      <Badge color="info" variant="subtle">
                        {asset.faction}
                      </Badge>
                    </Flex>
                    <Text size="xs" color="muted">
                      {asset.size}
                    </Text>
                  </Stack>
                </Card.Body>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Stack>
    )
  },
}

// ---------------------------------------------------------------------------
// 6. Command palette overlay (shows how Center + Box layer over a layout)
// ---------------------------------------------------------------------------
export const LayoutPrimitivesReference: Story = {
  name: 'Layout Primitives — Quick Reference',
  render: () => (
    <Box p={6}>
      <Container size="lg">
        <Stack gap={8}>
          <Stack gap={2}>
            <Heading level={1} size="2xl">
              Layout Primitives
            </Heading>
            <Text color="muted">
              ForgeUI ships 10 layout primitives. All accept token-aware shorthand props (p, m, gap,
              bg, radius). Combine them instead of writing raw flexbox/grid CSS.
            </Text>
          </Stack>

          {/* Box */}
          <Stack gap={3}>
            <Heading level={2} size="lg">
              Box — the base unit
            </Heading>
            <Text size="sm" color="muted">
              Every layout primitive is built on Box. Use it when you need padding, background,
              radius, or a custom HTML element — but don&apos;t need flex/grid behaviour.
            </Text>
            <Flex gap={3} wrap="wrap">
              <Box
                p={4}
                bg="surface"
                radius="md"
                style={{ border: '1px solid var(--forge-border)' }}
              >
                <Text size="sm">p=4 + bg=surface + radius=md</Text>
              </Box>
              <Box px={6} py={2} bg="accent" radius="full">
                <Text size="sm" style={{ color: 'var(--forge-text-on-accent)' }}>
                  px=6 py=2 bg=accent radius=full
                </Text>
              </Box>
              <Box
                as="section"
                p={3}
                bg="surface-raised"
                radius="sm"
                style={{ border: '1px solid var(--forge-border)' }}
              >
                <Text size="sm">as=&quot;section&quot; (polymorphic)</Text>
              </Box>
            </Flex>
          </Stack>

          <Separator />

          {/* Stack */}
          <Stack gap={3}>
            <Heading level={2} size="lg">
              Stack — vertical flow
            </Heading>
            <Text size="sm" color="muted">
              Column flexbox with a gap. The workhorse for form sections, sidebars, card bodies, and
              anything that stacks vertically.
            </Text>
            <Flex gap={6} align="flex-start">
              <Stack gap={2} style={{ width: 160 }}>
                <Box
                  p={2}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">gap=2</Text>
                </Box>
                <Box
                  p={2}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">Item 2</Text>
                </Box>
                <Box
                  p={2}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">Item 3</Text>
                </Box>
              </Stack>
              <Stack gap={5} style={{ width: 160 }}>
                <Box
                  p={2}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">gap=5</Text>
                </Box>
                <Box
                  p={2}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">Item 2</Text>
                </Box>
                <Box
                  p={2}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">Item 3</Text>
                </Box>
              </Stack>
            </Flex>
          </Stack>

          <Separator />

          {/* Flex + Spacer */}
          <Stack gap={3}>
            <Heading level={2} size="lg">
              Flex + Spacer — horizontal flow
            </Heading>
            <Text size="sm" color="muted">
              Flex is the horizontal counterpart to Stack. Add a Spacer to push items to opposite
              ends — classic toolbar pattern.
            </Text>
            <Stack gap={3}>
              <Box
                style={{ border: '1px dashed var(--forge-border)', borderRadius: 4, padding: 8 }}
              >
                <Flex gap={2} align="center">
                  <Badge color="accent">Logo</Badge>
                  <Spacer />
                  <Button size="sm" variant="ghost">
                    Help
                  </Button>
                  <Button size="sm" variant="primary">
                    Save
                  </Button>
                </Flex>
              </Box>
              <Box
                style={{ border: '1px dashed var(--forge-border)', borderRadius: 4, padding: 8 }}
              >
                <Flex gap={2} justify="space-between" align="center">
                  <Text size="sm">justify=space-between</Text>
                  <Badge color="success" variant="subtle">
                    Synced
                  </Badge>
                </Flex>
              </Box>
            </Stack>
          </Stack>

          <Separator />

          {/* Grid */}
          <Stack gap={3}>
            <Heading level={2} size="lg">
              Grid — CSS grid
            </Heading>
            <Text size="sm" color="muted">
              Numeric columns produce equal fractions. Pass a string for custom templates. Use
              Grid.Col to span columns or assign named areas.
            </Text>
            <Stack gap={3}>
              <Grid columns={3} gap={2}>
                {['span 12', 'span 4', 'span 4', 'span 4'].map((l, i) => (
                  <Box
                    key={i}
                    p={3}
                    bg="surface-raised"
                    radius="sm"
                    style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                  >
                    <Text size="xs" color="muted">
                      {l}
                    </Text>
                  </Box>
                ))}
              </Grid>
              <Grid columns="220px 1fr 280px" gap={2}>
                <Box
                  p={3}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">Sidebar 220px</Text>
                </Box>
                <Box
                  p={3}
                  bg="surface-raised"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">Canvas 1fr</Text>
                </Box>
                <Box
                  p={3}
                  bg="surface"
                  radius="sm"
                  style={{ border: '1px solid var(--forge-border)', textAlign: 'center' }}
                >
                  <Text size="xs">Inspector 280px</Text>
                </Box>
              </Grid>
            </Stack>
          </Stack>

          <Separator />

          {/* SimpleGrid + Wrap */}
          <Stack gap={3}>
            <Heading level={2} size="lg">
              SimpleGrid — equal columns
            </Heading>
            <Text size="sm" color="muted">
              Shorthand for equal-width grid layouts. Use minChildWidth for responsive auto-fit
              grids that don&apos;t need explicit breakpoints.
            </Text>
            <SimpleGrid minChildWidth="180px" spacing={3}>
              {['Entities', 'Quests', 'Factions', 'Locations', 'Events'].map((label) => (
                <Card key={label}>
                  <Card.Body>
                    <Text size="sm" weight="semibold">
                      {label}
                    </Text>
                  </Card.Body>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>

          <Separator />

          {/* Center + Container */}
          <Stack gap={3}>
            <Heading level={2} size="lg">
              Center + Container
            </Heading>
            <Text size="sm" color="muted">
              Center wraps content in flex with align+justify=center. Container adds a max-width
              with auto side margins — use it for readable prose widths.
            </Text>
            <Center
              style={{ height: 80, border: '1px dashed var(--forge-border)', borderRadius: 4 }}
            >
              <Badge color="accent">Centered content</Badge>
            </Center>
          </Stack>
        </Stack>
      </Container>
    </Box>
  ),
}
