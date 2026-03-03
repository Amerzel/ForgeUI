import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
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
  Steps,
  Spinner,
  Progress,
  ScrollArea,
  ResizablePanel,
  ResizablePanelGroup,
  PropertyGrid,
  DataTable,
  Accordion,
  type ColumnDef,
  type PropertySection,
} from '@forgeui/components'

/**
 * Forge-inspired full-page compositions.
 *
 * These stories demonstrate how to build complex, real-world tool UIs
 * using ForgeUI — inspired by the patterns found in the Forge workstation
 * (entity inspectors, validation dashboards, coverage matrices, module shells).
 *
 * Each is a self-contained, fully-interactive mockup showing what a polished
 * version of these screens looks like when ForgeUI layout primitives,
 * composite components, and complex data components work together.
 */
const meta: Meta = {
  title: 'Layout/Forge Patterns',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared helpers
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

function StatCard({
  label,
  value,
  delta,
  icon,
  color,
  onClick,
}: {
  label: string
  value: string | number
  delta?: string
  icon?: string
  color?: string
  onClick?: () => void
}) {
  return (
    <Card
      style={{ cursor: onClick ? 'pointer' : undefined, transition: 'border-color 0.15s' }}
      onClick={onClick}
    >
      <Card.Body>
        <Stack gap={1}>
          <Flex align="center" gap={2}>
            {icon && (
              <Text size="sm" style={{ opacity: 0.6 }}>
                {icon}
              </Text>
            )}
            <Text
              size="xs"
              color="muted"
              style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {label}
            </Text>
          </Flex>
          <Flex align="baseline" gap={2}>
            <Text
              size="2xl"
              weight="bold"
              style={{ color: color ? `var(--forge-${color})` : undefined }}
            >
              {value}
            </Text>
            {delta && (
              <Badge
                color={
                  delta.startsWith('+') ? 'success' : delta.startsWith('-') ? 'danger' : 'neutral'
                }
                variant="subtle"
              >
                {delta}
              </Badge>
            )}
          </Flex>
        </Stack>
      </Card.Body>
    </Card>
  )
}

function HealthRow({
  name,
  status,
  detail,
  icon,
}: {
  name: string
  status: 'ok' | 'warn' | 'error' | 'running'
  detail: string
  icon?: string
}) {
  const dotColor = {
    ok: 'var(--forge-success)',
    warn: 'var(--forge-warning)',
    error: 'var(--forge-danger)',
    running: 'var(--forge-info)',
  }[status]
  return (
    <Flex
      align="center"
      gap={3}
      py={1}
      style={{ borderBottom: '1px solid var(--forge-border-subtle)' }}
    >
      <Box
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: dotColor,
          flexShrink: 0,
        }}
      />
      {icon && (
        <Text size="sm" style={{ opacity: 0.6, width: 20, textAlign: 'center' }}>
          {icon}
        </Text>
      )}
      <Text size="sm" style={{ flex: 1 }}>
        {name}
      </Text>
      {status === 'running' && <Spinner size="sm" />}
      <Text size="xs" color="muted" style={{ fontFamily: 'var(--forge-font-mono)' }}>
        {detail}
      </Text>
    </Flex>
  )
}

function SidebarNavItem({
  label,
  icon,
  active = false,
  count,
  onClick,
}: {
  label: string
  icon: string
  active?: boolean
  count?: number
  onClick?: () => void
}) {
  return (
    <Box
      p={2}
      radius="sm"
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: active ? 'var(--forge-accent)' : undefined,
        color: active ? 'var(--forge-text-on-accent)' : 'var(--forge-text)',
      }}
      onClick={onClick}
    >
      <Text size="sm" style={{ opacity: active ? 1 : 0.5, width: 20, textAlign: 'center' }}>
        {icon}
      </Text>
      <Text size="sm" weight={active ? 'medium' : 'normal'} style={{ flex: 1 }}>
        {label}
      </Text>
      {count !== undefined && (
        <Badge
          variant={active ? 'solid' : 'subtle'}
          color={active ? 'accent' : 'neutral'}
          style={{ fontSize: '10px', minWidth: 20, textAlign: 'center' }}
        >
          {count}
        </Badge>
      )}
    </Box>
  )
}

// ---------------------------------------------------------------------------
// 1. Entity Inspector — resizable three-panel with DataTable + PropertyGrid
// ---------------------------------------------------------------------------

interface MockEntity {
  id: string
  name: string
  category: string
  lifecycle: string
  level: number
  faction: string
  tags: string
}

const MOCK_ENTITIES: MockEntity[] = [
  {
    id: 'ent-001',
    name: 'Goblin Chief',
    category: 'NPC',
    lifecycle: 'approved',
    level: 12,
    faction: 'Ironback Clan',
    tags: 'boss, aggressive',
  },
  {
    id: 'ent-002',
    name: 'Lady Aldra',
    category: 'NPC',
    lifecycle: 'canon',
    level: 20,
    faction: 'Sunguard',
    tags: 'questgiver, noble',
  },
  {
    id: 'ent-003',
    name: 'Marsh Wraith',
    category: 'Enemy',
    lifecycle: 'draft',
    level: 8,
    faction: 'Wraiths',
    tags: 'undead, ranged',
  },
  {
    id: 'ent-004',
    name: 'Iron Golem',
    category: 'Enemy',
    lifecycle: 'proposed',
    level: 15,
    faction: 'Ironback Clan',
    tags: 'construct, boss',
  },
  {
    id: 'ent-005',
    name: 'Healing Potion',
    category: 'Item',
    lifecycle: 'approved',
    level: 1,
    faction: '—',
    tags: 'consumable',
  },
  {
    id: 'ent-006',
    name: 'Flamebrand',
    category: 'Weapon',
    lifecycle: 'canon',
    level: 10,
    faction: '—',
    tags: 'rare, fire',
  },
  {
    id: 'ent-007',
    name: 'East Marsh',
    category: 'Location',
    lifecycle: 'approved',
    level: 5,
    faction: '—',
    tags: 'zone, outdoor',
  },
  {
    id: 'ent-008',
    name: 'Iron Fortress',
    category: 'Location',
    lifecycle: 'draft',
    level: 14,
    faction: 'Ironback Clan',
    tags: 'zone, dungeon',
  },
  {
    id: 'ent-009',
    name: 'Shadow Priest',
    category: 'NPC',
    lifecycle: 'proposed',
    level: 18,
    faction: 'Wraiths',
    tags: 'elite, caster',
  },
  {
    id: 'ent-010',
    name: 'Crystal Shield',
    category: 'Armor',
    lifecycle: 'draft',
    level: 12,
    faction: '—',
    tags: 'epic, magic',
  },
  {
    id: 'ent-011',
    name: 'Siege Crossbow',
    category: 'Weapon',
    lifecycle: 'approved',
    level: 16,
    faction: 'Sunguard',
    tags: 'ranged, siege',
  },
  {
    id: 'ent-012',
    name: 'Plague Rat',
    category: 'Enemy',
    lifecycle: 'canon',
    level: 2,
    faction: '—',
    tags: 'swarm, disease',
  },
]

const ENTITY_COLUMNS: ColumnDef<MockEntity>[] = [
  { accessorKey: 'name', header: 'Name', size: 160 },
  {
    accessorKey: 'category',
    header: 'Type',
    size: 90,
    cell: (info) => (
      <Badge variant="subtle" color="accent">
        {info.getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: 'lifecycle',
    header: 'State',
    size: 90,
    cell: (info) => {
      const s = info.getValue<string>()
      const c =
        s === 'canon'
          ? 'success'
          : s === 'approved'
            ? 'info'
            : s === 'proposed'
              ? 'warning'
              : 'neutral'
      return (
        <Badge variant="subtle" color={c}>
          {s}
        </Badge>
      )
    },
  },
  { accessorKey: 'level', header: 'Lv', size: 50 },
  { accessorKey: 'faction', header: 'Faction', size: 120 },
]

export const EntityInspector: Story = {
  name: 'Entity Inspector (Three-Panel)',
  render: function EntityInspectorDemo() {
    const [selectedId, setSelectedId] = useState('ent-001')
    const entity = MOCK_ENTITIES.find((e) => e.id === selectedId) ?? MOCK_ENTITIES[0]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- MOCK_ENTITIES is a non-empty const array
    const e = entity!

    const sections: PropertySection[] = [
      {
        label: 'Identity',
        defaultOpen: true,
        items: [
          { key: 'name', label: 'Name', type: 'text' },
          {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: [
              { value: 'NPC', label: 'NPC' },
              { value: 'Enemy', label: 'Enemy' },
              { value: 'Item', label: 'Item' },
              { value: 'Weapon', label: 'Weapon' },
              { value: 'Armor', label: 'Armor' },
              { value: 'Location', label: 'Location' },
            ],
          },
          { key: 'faction', label: 'Faction', type: 'text' },
        ],
      },
      {
        label: 'Gameplay',
        defaultOpen: true,
        items: [
          { key: 'level', label: 'Level', type: 'number', min: 1, max: 100, step: 1 },
          { key: 'aggressive', label: 'Aggressive', type: 'boolean' },
          { key: 'spawnRate', label: 'Spawn Rate', type: 'number', min: 0, max: 10, step: 0.5 },
        ],
      },
      {
        label: 'Visual',
        defaultOpen: false,
        items: [
          { key: 'tintColor', label: 'Tint Color', type: 'color' },
          { key: 'scale', label: 'Scale', type: 'vec3' },
        ],
      },
    ]

    const [values, setValues] = useState<Record<string, unknown>>({
      name: e.name,
      category: e.category,
      faction: e.faction,
      level: e.level,
      aggressive: true,
      spawnRate: 2.5,
      tintColor: '#e94560',
      scale: [1, 1, 1],
    })

    return (
      <Grid columns="1fr" style={{ height: '100vh' }}>
        <Stack gap={0} style={{ overflow: 'hidden' }}>
          {/* Toolbar */}
          <Box px={3} py={2} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
            <Group gap={2}>
              <Badge
                color="accent"
                variant="solid"
                style={{ fontFamily: 'var(--forge-font-mono)' }}
              >
                EA
              </Badge>
              <Heading level={4} size="sm">
                Entity Catalog
              </Heading>
              <Separator orientation="vertical" style={{ height: 20 }} />
              <Wrap gap={2}>
                {['All', 'NPC', 'Enemy', 'Item', 'Weapon', 'Location'].map((cat, i) => (
                  <Badge
                    key={cat}
                    variant={i === 0 ? 'solid' : 'subtle'}
                    color={i === 0 ? 'accent' : 'neutral'}
                    style={{ cursor: 'pointer' }}
                  >
                    {cat}
                    {i === 0 && ` (${MOCK_ENTITIES.length})`}
                  </Badge>
                ))}
              </Wrap>
              <Spacer />
              <Badge color="success" variant="subtle">
                8 canon
              </Badge>
              <Separator orientation="vertical" style={{ height: 20 }} />
              <Button size="sm" variant="ghost">
                Validate All
              </Button>
              <Button size="sm" variant="primary">
                + Entity
              </Button>
            </Group>
          </Box>

          {/* Three-panel body */}
          <Flex style={{ flex: 1, overflow: 'hidden' }}>
            {/* Left: Data Table */}
            <Box
              style={{
                width: '45%',
                borderRight: '1px solid var(--forge-border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box px={3} py={2} style={{ borderBottom: '1px solid var(--forge-border)' }}>
                <Input placeholder="Search entities…" size="sm" />
              </Box>
              <Box style={{ flex: 1, overflow: 'auto' }}>
                <DataTable columns={ENTITY_COLUMNS} data={MOCK_ENTITIES} sorting filtering />
              </Box>
            </Box>

            {/* Center: Entity Detail */}
            <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box px={4} py={3} style={{ borderBottom: '1px solid var(--forge-border)' }}>
                <Flex align="center" gap={3}>
                  <Text size="lg" weight="bold">
                    🧑 {e.name}
                  </Text>
                  <Badge variant="subtle" color="accent">
                    {e.category}
                  </Badge>
                  <Badge
                    variant="subtle"
                    color={
                      e.lifecycle === 'canon'
                        ? 'success'
                        : e.lifecycle === 'approved'
                          ? 'info'
                          : 'warning'
                    }
                  >
                    {e.lifecycle}
                  </Badge>
                  <Spacer />
                  <Group gap={1}>
                    <Button size="sm" variant="ghost">
                      Validate
                    </Button>
                    <Button size="sm" variant="ghost">
                      References
                    </Button>
                    <Button size="sm" variant="primary">
                      Promote → canon
                    </Button>
                  </Group>
                </Flex>
              </Box>

              <Box p={4} style={{ flex: 1, overflowY: 'auto' }}>
                <Container size="md">
                  <Stack gap={5}>
                    {/* Quick stats */}
                    <SimpleGrid cols={4} spacing={3}>
                      <StatCard label="Level" value={e.level} icon="⚔️" />
                      <StatCard
                        label="Faction"
                        value={e.faction === '—' ? 'None' : (e.faction.split(' ')[0] ?? e.faction)}
                        icon="🛡️"
                      />
                      <StatCard label="References" value={7} delta="+2" icon="🔗" />
                      <StatCard label="Issues" value={0} icon="✓" color="success" />
                    </SimpleGrid>

                    {/* Tabs */}
                    <Tabs
                      defaultValue="overview"
                      items={[
                        {
                          value: 'overview',
                          label: 'Overview',
                          content: (
                            <Stack gap={4} py={3}>
                              <Stack gap={2}>
                                <SectionLabel>Description</SectionLabel>
                                <Text color="muted" size="sm">
                                  Krag the Ironback leads the largest goblin clan in
                                  Eldenmoor&apos;s eastern marshes. Born from the ashes of the
                                  Sunguard conflict, he has united three rival clans under a single
                                  banner through fear, cunning, and an unnatural resistance to fire.
                                </Text>
                              </Stack>
                              <Stack gap={2}>
                                <SectionLabel>Traits</SectionLabel>
                                <Wrap gap={2}>
                                  {e.tags.split(', ').map((t) => (
                                    <Badge key={t} variant="subtle" color="warning">
                                      {t}
                                    </Badge>
                                  ))}
                                </Wrap>
                              </Stack>
                              <Stack gap={2}>
                                <SectionLabel>Relationships</SectionLabel>
                                {[
                                  { target: 'Ironback Clan', rel: 'leader of', color: 'accent' },
                                  { target: 'Lady Aldra', rel: 'enemy of', color: 'danger' },
                                  { target: 'East Marsh', rel: 'spawns in', color: 'info' },
                                ].map((r) => (
                                  <Flex key={r.target} align="center" gap={2} py={1}>
                                    <Badge
                                      variant="outline"
                                      color={r.color as 'accent' | 'danger' | 'info'}
                                    >
                                      {r.rel}
                                    </Badge>
                                    <Text
                                      size="sm"
                                      weight="medium"
                                      style={{ color: 'var(--forge-accent)', cursor: 'pointer' }}
                                    >
                                      {r.target}
                                    </Text>
                                  </Flex>
                                ))}
                              </Stack>
                            </Stack>
                          ),
                        },
                        {
                          value: 'stats',
                          label: 'Stats',
                          content: (
                            <Text color="muted" size="sm" style={{ padding: '16px 0' }}>
                              Combat stats, loot tables, and progression curves…
                            </Text>
                          ),
                        },
                        {
                          value: 'history',
                          label: 'History (3)',
                          content: (
                            <Text color="muted" size="sm" style={{ padding: '16px 0' }}>
                              Version history and change log…
                            </Text>
                          ),
                        },
                        {
                          value: 'raw',
                          label: 'Raw JSON',
                          content: (
                            <Text color="muted" size="sm" style={{ padding: '16px 0' }}>
                              Raw artifact data…
                            </Text>
                          ),
                        },
                      ]}
                    />
                  </Stack>
                </Container>
              </Box>
            </Box>

            {/* Right: Property Inspector */}
            <Stack
              gap={0}
              bg="surface"
              style={{
                width: 280,
                borderLeft: '1px solid var(--forge-border)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Box px={3} py={2} style={{ borderBottom: '1px solid var(--forge-border)' }}>
                <Flex align="center" gap={2}>
                  <Text size="sm" weight="semibold">
                    Inspector
                  </Text>
                  <Spacer />
                  <Text size="xs" color="muted" style={{ fontFamily: 'var(--forge-font-mono)' }}>
                    {e.id}
                  </Text>
                </Flex>
              </Box>
              <Box style={{ flex: 1, overflow: 'auto' }}>
                <PropertyGrid
                  sections={sections}
                  values={values}
                  onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
                />
              </Box>
              <Box p={2} style={{ borderTop: '1px solid var(--forge-border)' }}>
                <Group gap={1} grow>
                  <Button size="sm" variant="ghost">
                    Reset
                  </Button>
                  <Button size="sm" variant="primary">
                    Save
                  </Button>
                </Group>
              </Box>
            </Stack>
          </Flex>
        </Stack>
      </Grid>
    )
  },
}

// ---------------------------------------------------------------------------
// 2. Validation Command Center — structured results, not JSON dumps
// ---------------------------------------------------------------------------

interface ValidationCheck {
  id: string
  tool: string
  label: string
  icon: string
  status: 'pass' | 'warn' | 'fail' | 'running' | 'idle'
  duration?: string
  issueCount: number
  issues?: { path: string; message: string; severity: 'error' | 'warning' }[]
}

const MOCK_CHECKS: ValidationCheck[] = [
  {
    id: 'entity-orphans',
    tool: 'forge-entity',
    label: 'Entity Orphan Check',
    icon: '👤',
    status: 'pass',
    duration: '0.8s',
    issueCount: 0,
  },
  {
    id: 'entity-validate',
    tool: 'forge-entity',
    label: 'Entity Schema Validation',
    icon: '👤',
    status: 'warn',
    duration: '1.2s',
    issueCount: 3,
    issues: [
      {
        path: 'entities/marsh-wraith.yaml',
        message: 'Missing required field: loot_table',
        severity: 'warning',
      },
      {
        path: 'entities/iron-golem.yaml',
        message: 'Spawn rate exceeds zone capacity (10 > 8)',
        severity: 'warning',
      },
      {
        path: 'entities/shadow-priest.yaml',
        message: 'Referenced ability "shadow_bolt_v2" not found',
        severity: 'error',
      },
    ],
  },
  {
    id: 'quest-validate',
    tool: 'forge-quest',
    label: 'Quest Validation',
    icon: '📜',
    status: 'pass',
    duration: '0.6s',
    issueCount: 0,
  },
  {
    id: 'encounter-stats',
    tool: 'forge-encounter',
    label: 'Encounter Balance',
    icon: '⚔️',
    status: 'warn',
    duration: '2.1s',
    issueCount: 1,
    issues: [
      {
        path: 'encounters/east-marsh-ambush',
        message: 'Encounter CR 14 exceeds zone max level 8 by 6 levels',
        severity: 'warning',
      },
    ],
  },
  {
    id: 'rules-validate',
    tool: 'forge-rules',
    label: 'Game Rules Schema',
    icon: '📐',
    status: 'pass',
    duration: '0.3s',
    issueCount: 0,
  },
  {
    id: 'director-orphans',
    tool: 'forge-director',
    label: 'Director Orphan Refs',
    icon: '🎬',
    status: 'fail',
    duration: '1.5s',
    issueCount: 2,
    issues: [
      {
        path: 'zones/iron-fortress/refs.yaml',
        message: 'Entity ref "ent-099" does not exist',
        severity: 'error',
      },
      {
        path: 'zones/east-marsh/refs.yaml',
        message: 'Quest ref "quest-deleted" not found',
        severity: 'error',
      },
    ],
  },
]

export const ValidationCommandCenter: Story = {
  name: 'Validation Command Center',
  render: () => {
    const passCount = MOCK_CHECKS.filter((c) => c.status === 'pass').length
    const warnCount = MOCK_CHECKS.filter((c) => c.status === 'warn').length
    const failCount = MOCK_CHECKS.filter((c) => c.status === 'fail').length
    const totalIssues = MOCK_CHECKS.reduce((s, c) => s + c.issueCount, 0)
    const totalTime = MOCK_CHECKS.reduce((s, c) => s + parseFloat(c.duration ?? '0'), 0).toFixed(1)

    return (
      <Stack gap={0} style={{ height: '100vh' }}>
        {/* Top bar */}
        <Box px={6} py={3} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Group gap={3}>
            <Badge color="accent" variant="solid" style={{ fontFamily: 'var(--forge-font-mono)' }}>
              ✓
            </Badge>
            <Heading level={3} size="md">
              Validation Command Center
            </Heading>
            <Badge
              color={failCount > 0 ? 'danger' : warnCount > 0 ? 'warning' : 'success'}
              variant="subtle"
            >
              {failCount > 0
                ? `${failCount} failing`
                : warnCount > 0
                  ? `${warnCount} warnings`
                  : 'All passing'}
            </Badge>
            <Spacer />
            <Text size="xs" color="muted">
              Completed in {totalTime}s
            </Text>
            <Separator orientation="vertical" style={{ height: 20 }} />
            <Button size="sm" variant="ghost">
              Export Report
            </Button>
            <Button size="sm" variant="primary">
              Run All Checks
            </Button>
          </Group>
        </Box>

        <Box p={6} style={{ flex: 1, overflowY: 'auto' }}>
          <Container size="lg">
            <Stack gap={6}>
              {/* Summary stats */}
              <SimpleGrid cols={5} spacing={3}>
                <StatCard label="Total Checks" value={MOCK_CHECKS.length} icon="🔍" />
                <StatCard label="Passing" value={passCount} icon="✅" color="success" />
                <StatCard label="Warnings" value={warnCount} icon="⚠️" color="warning" />
                <StatCard label="Failing" value={failCount} icon="❌" color="danger" />
                <StatCard
                  label="Total Issues"
                  value={totalIssues}
                  icon="📋"
                  {...(totalIssues > 0 ? { delta: `-${totalIssues}` } : {})}
                />
              </SimpleGrid>

              {/* Progress overview */}
              <Card>
                <Card.Body>
                  <Stack gap={3}>
                    <Flex align="center" gap={2}>
                      <Text weight="semibold">Check Progress</Text>
                      <Spacer />
                      <Badge variant="subtle" color="success">
                        {passCount}/{MOCK_CHECKS.length} complete
                      </Badge>
                    </Flex>
                    <Progress
                      value={Math.round((passCount / MOCK_CHECKS.length) * 100)}
                      variant={failCount > 0 ? 'danger' : 'success'}
                      size="md"
                    />
                  </Stack>
                </Card.Body>
              </Card>

              {/* Individual check results */}
              <Stack gap={3}>
                <Flex align="center" gap={2}>
                  <Text weight="semibold">Check Results</Text>
                  <Spacer />
                  <Group gap={1}>
                    {(['all', 'failing', 'warnings'] as const).map((f, i) => (
                      <Badge
                        key={f}
                        variant={i === 0 ? 'solid' : 'subtle'}
                        color={i === 0 ? 'accent' : 'neutral'}
                        style={{ cursor: 'pointer' }}
                      >
                        {f}
                      </Badge>
                    ))}
                  </Group>
                </Flex>

                {MOCK_CHECKS.map((check) => (
                  <Card
                    key={check.id}
                    style={{
                      borderLeft: `3px solid var(--forge-${check.status === 'pass' ? 'success' : check.status === 'warn' ? 'warning' : check.status === 'fail' ? 'danger' : 'border'})`,
                    }}
                  >
                    <Card.Body>
                      <Stack gap={3}>
                        {/* Check header */}
                        <Flex align="center" gap={3}>
                          <Text size="lg">{check.icon}</Text>
                          <Stack gap={0} style={{ flex: 1 }}>
                            <Flex align="center" gap={2}>
                              <Text weight="semibold">{check.label}</Text>
                              <Badge
                                variant="subtle"
                                color={
                                  check.status === 'pass'
                                    ? 'success'
                                    : check.status === 'warn'
                                      ? 'warning'
                                      : 'danger'
                                }
                              >
                                {check.status === 'pass'
                                  ? 'Pass'
                                  : check.status === 'warn'
                                    ? `${check.issueCount} warnings`
                                    : `${check.issueCount} errors`}
                              </Badge>
                            </Flex>
                            <Flex gap={3}>
                              <Text
                                size="xs"
                                color="muted"
                                style={{ fontFamily: 'var(--forge-font-mono)' }}
                              >
                                {check.tool}
                              </Text>
                              {check.duration && (
                                <Text size="xs" color="muted">
                                  {check.duration}
                                </Text>
                              )}
                            </Flex>
                          </Stack>
                          <Group gap={1}>
                            <Button size="sm" variant="ghost">
                              Re-run
                            </Button>
                            {check.issueCount > 0 && (
                              <Button size="sm" variant="ghost">
                                Auto-fix
                              </Button>
                            )}
                          </Group>
                        </Flex>

                        {/* Issue list */}
                        {check.issues && check.issues.length > 0 && (
                          <Box bg="surface-raised" radius="md" p={3}>
                            <Stack gap={2}>
                              {check.issues.map((issue, i) => (
                                <Flex key={i} align="flex-start" gap={2}>
                                  <Badge
                                    variant="solid"
                                    color={issue.severity === 'error' ? 'danger' : 'warning'}
                                    style={{ fontSize: '10px', flexShrink: 0, marginTop: 2 }}
                                  >
                                    {issue.severity === 'error' ? 'ERR' : 'WRN'}
                                  </Badge>
                                  <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                      size="xs"
                                      weight="medium"
                                      style={{
                                        fontFamily: 'var(--forge-font-mono)',
                                        color: 'var(--forge-accent)',
                                      }}
                                    >
                                      {issue.path}
                                    </Text>
                                    <Text size="sm" color="muted">
                                      {issue.message}
                                    </Text>
                                  </Stack>
                                </Flex>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    </Card.Body>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Stack>
    )
  },
}

// ---------------------------------------------------------------------------
// 3. Coverage Matrix — rich heatmap table with pipeline status
// ---------------------------------------------------------------------------

interface ZoneCoverage {
  id: string
  name: string
  tier: string
  levels: string
  lifecycle: string
  entity: number
  quest: number
  encounter: number
  terrain: number
  lore: number
  asset: number
  total: number
  pipeline: { intent: boolean; map: boolean; refs: boolean; pack: boolean }
}

const ZONE_DATA: ZoneCoverage[] = [
  {
    id: 'east-marsh',
    name: 'East Marsh',
    tier: 'Starter',
    levels: '1–5',
    lifecycle: 'validated',
    entity: 8,
    quest: 3,
    encounter: 5,
    terrain: 1,
    lore: 4,
    asset: 6,
    total: 27,
    pipeline: { intent: true, map: true, refs: true, pack: true },
  },
  {
    id: 'iron-fortress',
    name: 'Iron Fortress',
    tier: 'Mid',
    levels: '10–15',
    lifecycle: 'designed',
    entity: 12,
    quest: 5,
    encounter: 8,
    terrain: 1,
    lore: 6,
    asset: 10,
    total: 42,
    pipeline: { intent: true, map: true, refs: true, pack: false },
  },
  {
    id: 'sunguard-city',
    name: 'Sunguard City',
    tier: 'Hub',
    levels: '1–20',
    lifecycle: 'designed',
    entity: 15,
    quest: 8,
    encounter: 2,
    terrain: 1,
    lore: 12,
    asset: 8,
    total: 46,
    pipeline: { intent: true, map: true, refs: false, pack: false },
  },
  {
    id: 'dark-hollow',
    name: 'Dark Hollow',
    tier: 'High',
    levels: '15–20',
    lifecycle: 'draft',
    entity: 4,
    quest: 1,
    encounter: 3,
    terrain: 0,
    lore: 2,
    asset: 0,
    total: 10,
    pipeline: { intent: true, map: false, refs: false, pack: false },
  },
  {
    id: 'crystal-caves',
    name: 'Crystal Caves',
    tier: 'Mid',
    levels: '8–12',
    lifecycle: 'draft',
    entity: 6,
    quest: 2,
    encounter: 4,
    terrain: 0,
    lore: 3,
    asset: 0,
    total: 15,
    pipeline: { intent: true, map: false, refs: false, pack: false },
  },
  {
    id: 'wraith-bog',
    name: 'Wraith Bog',
    tier: 'High',
    levels: '12–18',
    lifecycle: 'validated',
    entity: 10,
    quest: 4,
    encounter: 7,
    terrain: 1,
    lore: 5,
    asset: 8,
    total: 35,
    pipeline: { intent: true, map: true, refs: true, pack: true },
  },
]

function CoverageHeatCell({ count, max }: { count: number; max: number }) {
  const intensity = max > 0 ? count / max : 0
  const color =
    count === 0 ? 'neutral' : intensity > 0.6 ? 'success' : intensity > 0.3 ? 'warning' : 'danger'
  return (
    <td style={{ padding: '6px 8px', textAlign: 'center' }}>
      <Badge variant={count === 0 ? 'outline' : 'subtle'} color={color} style={{ minWidth: 28 }}>
        {count}
      </Badge>
    </td>
  )
}

function PipelineDot({ done }: { done: boolean }) {
  return (
    <td style={{ padding: '6px 8px', textAlign: 'center' }}>
      <Box
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          margin: '0 auto',
          backgroundColor: done ? 'var(--forge-success)' : 'var(--forge-border)',
          boxShadow: done ? '0 0 6px var(--forge-success)' : 'none',
          transition: 'all 0.2s',
        }}
      />
    </td>
  )
}

export const CoverageHeatmap: Story = {
  name: 'Coverage Matrix & Heatmap',
  render: () => {
    const maxEntity = Math.max(...ZONE_DATA.map((z) => z.entity))
    const maxQuest = Math.max(...ZONE_DATA.map((z) => z.quest))
    const maxEncounter = Math.max(...ZONE_DATA.map((z) => z.encounter))
    const maxLore = Math.max(...ZONE_DATA.map((z) => z.lore))
    const maxAsset = Math.max(...ZONE_DATA.map((z) => z.asset))
    const packedCount = ZONE_DATA.filter((z) => z.pipeline.pack).length
    const gaps = ZONE_DATA.flatMap((z) => {
      const missing: string[] = []
      if (z.terrain === 0) missing.push(`${z.name} → Terrain`)
      if (z.asset === 0) missing.push(`${z.name} → Asset`)
      if (z.encounter === 0) missing.push(`${z.name} → Encounter`)
      return missing
    })

    return (
      <Stack gap={0} style={{ height: '100vh' }}>
        {/* Header */}
        <Box px={6} py={3} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Group gap={3}>
            <Heading level={3} size="md">
              Coverage Dashboard
            </Heading>
            <Badge color="info" variant="subtle">
              Cross-tool completeness
            </Badge>
            <Spacer />
            <Text size="sm" color="muted">
              Pack coverage:
            </Text>
            <Badge variant="solid" color={packedCount === ZONE_DATA.length ? 'success' : 'warning'}>
              {packedCount}/{ZONE_DATA.length} zones
            </Badge>
            <Button size="sm" variant="primary">
              Export Report
            </Button>
          </Group>
        </Box>

        <Box p={6} style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap={6}>
            {/* Summary row */}
            <SimpleGrid cols={4} spacing={3}>
              <StatCard label="Zones" value={ZONE_DATA.length} icon="🗺️" />
              <StatCard
                label="Total Refs"
                value={ZONE_DATA.reduce((s, z) => s + z.total, 0)}
                icon="🔗"
                delta="+14"
              />
              <StatCard
                label="Pack Coverage"
                value={`${Math.round((packedCount / ZONE_DATA.length) * 100)}%`}
                icon="📦"
                color={packedCount === ZONE_DATA.length ? 'success' : 'warning'}
              />
              <StatCard
                label="Coverage Gaps"
                value={gaps.length}
                icon="⚠️"
                color={gaps.length > 0 ? 'danger' : 'success'}
              />
            </SimpleGrid>

            {/* Heatmap matrix */}
            <Card>
              <Card.Body>
                <Stack gap={3}>
                  <Flex align="center" gap={2}>
                    <Text weight="semibold">Zone × Tool Coverage</Text>
                    <Spacer />
                    <Text size="xs" color="muted">
                      Color intensity = relative density
                    </Text>
                  </Flex>

                  <Box style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--forge-border)' }}>
                          <th style={{ textAlign: 'left', padding: '8px 12px' }}>
                            <SectionLabel>Zone</SectionLabel>
                          </th>
                          {['Entity', 'Quest', 'Encounter', 'Terrain', 'Lore', 'Asset'].map((h) => (
                            <th key={h} style={{ textAlign: 'center', padding: '8px' }}>
                              <SectionLabel>{h}</SectionLabel>
                            </th>
                          ))}
                          <th
                            style={{
                              textAlign: 'center',
                              padding: '8px',
                              borderLeft: '2px solid var(--forge-border)',
                            }}
                          >
                            <SectionLabel>Total</SectionLabel>
                          </th>
                          {['Intent', 'Map', 'Refs', 'Pack'].map((h) => (
                            <th key={h} style={{ textAlign: 'center', padding: '8px' }}>
                              <SectionLabel>{h}</SectionLabel>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ZONE_DATA.map((zone) => (
                          <tr
                            key={zone.id}
                            style={{ borderBottom: '1px solid var(--forge-border)' }}
                          >
                            <td style={{ padding: '8px 12px' }}>
                              <Stack gap={0}>
                                <Flex align="center" gap={2}>
                                  <Text size="sm" weight="medium">
                                    {zone.name}
                                  </Text>
                                  <Badge
                                    variant="subtle"
                                    color={
                                      zone.lifecycle === 'validated'
                                        ? 'success'
                                        : zone.lifecycle === 'designed'
                                          ? 'info'
                                          : 'neutral'
                                    }
                                    style={{ fontSize: '10px' }}
                                  >
                                    {zone.lifecycle}
                                  </Badge>
                                </Flex>
                                <Text size="xs" color="muted">
                                  {zone.tier} · Lv {zone.levels}
                                </Text>
                              </Stack>
                            </td>
                            <CoverageHeatCell count={zone.entity} max={maxEntity} />
                            <CoverageHeatCell count={zone.quest} max={maxQuest} />
                            <CoverageHeatCell count={zone.encounter} max={maxEncounter} />
                            <CoverageHeatCell count={zone.terrain} max={1} />
                            <CoverageHeatCell count={zone.lore} max={maxLore} />
                            <CoverageHeatCell count={zone.asset} max={maxAsset} />
                            <td
                              style={{
                                padding: '6px 8px',
                                textAlign: 'center',
                                borderLeft: '2px solid var(--forge-border)',
                              }}
                            >
                              <Badge variant="outline" color="accent" style={{ fontWeight: 600 }}>
                                {zone.total}
                              </Badge>
                            </td>
                            <PipelineDot done={zone.pipeline.intent} />
                            <PipelineDot done={zone.pipeline.map} />
                            <PipelineDot done={zone.pipeline.refs} />
                            <PipelineDot done={zone.pipeline.pack} />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Stack>
              </Card.Body>
            </Card>

            {/* Gap detection */}
            <Grid columns="1fr 1fr" gap={4}>
              <Card>
                <Card.Body>
                  <Stack gap={3}>
                    <Flex align="center" gap={2}>
                      <Text weight="semibold">Coverage Gaps</Text>
                      <Badge variant="subtle" color={gaps.length > 0 ? 'danger' : 'success'}>
                        {gaps.length}
                      </Badge>
                    </Flex>
                    <Separator />
                    {gaps.length > 0 ? (
                      <Wrap gap={2}>
                        {gaps.map((g, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            color="warning"
                            style={{ cursor: 'pointer' }}
                          >
                            {g}
                          </Badge>
                        ))}
                      </Wrap>
                    ) : (
                      <Flex align="center" gap={2}>
                        <Badge variant="subtle" color="success">
                          ✓
                        </Badge>
                        <Text size="sm" color="muted">
                          All zones have full tool coverage
                        </Text>
                      </Flex>
                    )}
                  </Stack>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Stack gap={3}>
                    <Flex align="center" gap={2}>
                      <Text weight="semibold">Pipeline Progress</Text>
                      <Spacer />
                      <Badge variant="subtle" color="info">
                        {packedCount} shipped
                      </Badge>
                    </Flex>
                    <Separator />
                    <Stack gap={2}>
                      {ZONE_DATA.map((z) => {
                        const steps = Object.values(z.pipeline).filter(Boolean).length
                        return (
                          <Flex key={z.id} align="center" gap={3}>
                            <Text size="sm" style={{ width: 120 }}>
                              {z.name}
                            </Text>
                            <Box style={{ flex: 1 }}>
                              <Progress
                                value={steps * 25}
                                variant={steps === 4 ? 'success' : 'warning'}
                                size="sm"
                              />
                            </Box>
                            <Text size="xs" color="muted" style={{ width: 30, textAlign: 'right' }}>
                              {steps}/4
                            </Text>
                          </Flex>
                        )
                      })}
                    </Stack>
                  </Stack>
                </Card.Body>
              </Card>
            </Grid>
          </Stack>
        </Box>
      </Stack>
    )
  },
}

// ---------------------------------------------------------------------------
// 4. Module Shell — sidebar nav + toolbar + content with proper hierarchy
// ---------------------------------------------------------------------------

export const ModuleShellTemplate: Story = {
  name: 'Module Shell (Reusable Template)',
  render: function ModuleShellDemo() {
    const [activeModule, setActiveModule] = useState('entities')
    const [activeView, setActiveView] = useState('catalog')

    return (
      <Grid columns="220px 1fr" style={{ height: '100vh' }}>
        {/* Sidebar */}
        <Stack
          gap={0}
          bg="surface"
          style={{ borderRight: '1px solid var(--forge-border)', overflow: 'hidden' }}
        >
          {/* App header */}
          <Box p={3} style={{ borderBottom: '1px solid var(--forge-border)' }}>
            <Flex align="center" gap={2}>
              <Text size="lg" weight="bold" style={{ color: 'var(--forge-accent)' }}>
                ⚒
              </Text>
              <Text size="sm" weight="bold">
                Forge
              </Text>
              <Spacer />
              <Badge variant="subtle" color="success" style={{ fontSize: '10px' }}>
                Connected
              </Badge>
            </Flex>
          </Box>

          {/* Primary nav */}
          <Box p={2} style={{ flex: 1, overflowY: 'auto' }}>
            <Stack gap={1}>
              <SidebarNavItem
                label="Dashboard"
                icon="📊"
                active={activeModule === 'dashboard'}
                onClick={() => setActiveModule('dashboard')}
              />

              <Box px={2} py={2}>
                <SectionLabel>Design Tools</SectionLabel>
              </Box>
              <SidebarNavItem
                label="Entities"
                icon="👤"
                active={activeModule === 'entities'}
                count={142}
                onClick={() => setActiveModule('entities')}
              />
              <SidebarNavItem
                label="Quests"
                icon="📜"
                active={activeModule === 'quests'}
                count={38}
                onClick={() => setActiveModule('quests')}
              />
              <SidebarNavItem
                label="Encounters"
                icon="⚔️"
                active={activeModule === 'encounters'}
                count={24}
                onClick={() => setActiveModule('encounters')}
              />
              <SidebarNavItem
                label="Lore"
                icon="📚"
                active={activeModule === 'lore'}
                onClick={() => setActiveModule('lore')}
              />

              <Box px={2} py={2}>
                <SectionLabel>Infrastructure</SectionLabel>
              </Box>
              <SidebarNavItem
                label="Director"
                icon="🎬"
                active={activeModule === 'director'}
                count={6}
                onClick={() => setActiveModule('director')}
              />
              <SidebarNavItem
                label="Pipeline"
                icon="🔧"
                active={activeModule === 'pipeline'}
                onClick={() => setActiveModule('pipeline')}
              />
              <SidebarNavItem
                label="Terrain"
                icon="🏔️"
                active={activeModule === 'terrain'}
                onClick={() => setActiveModule('terrain')}
              />
              <SidebarNavItem
                label="Assets"
                icon="🎨"
                active={activeModule === 'assets'}
                onClick={() => setActiveModule('assets')}
              />
              <SidebarNavItem
                label="Rules"
                icon="📐"
                active={activeModule === 'rules'}
                onClick={() => setActiveModule('rules')}
              />
            </Stack>
          </Box>

          {/* Sidebar footer */}
          <Stack gap={1} p={2} style={{ borderTop: '1px solid var(--forge-border)' }}>
            <SidebarNavItem
              label="Validation"
              icon="✓"
              active={activeModule === 'validation'}
              onClick={() => setActiveModule('validation')}
            />
            <SidebarNavItem
              label="Coverage"
              icon="📈"
              active={activeModule === 'coverage'}
              onClick={() => setActiveModule('coverage')}
            />
            <Separator />
            <SidebarNavItem
              label="Settings"
              icon="⚙️"
              active={activeModule === 'settings'}
              onClick={() => setActiveModule('settings')}
            />
          </Stack>
        </Stack>

        {/* Main content */}
        <Stack gap={0} style={{ overflow: 'hidden' }}>
          {/* Module toolbar */}
          <Box px={4} py={2} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
            <Group gap={2}>
              <Badge
                color="accent"
                variant="solid"
                style={{ fontFamily: 'var(--forge-font-mono)' }}
              >
                EA
              </Badge>
              <Heading level={4} size="sm">
                Entities
              </Heading>
              <Separator orientation="vertical" style={{ height: 20 }} />

              {/* View switcher */}
              <Group gap={1}>
                {[
                  { id: 'catalog', label: 'Catalog' },
                  { id: 'graph', label: 'Graph' },
                  { id: 'analytics', label: 'Analytics' },
                ].map((v) => (
                  <Badge
                    key={v.id}
                    variant={activeView === v.id ? 'solid' : 'subtle'}
                    color={activeView === v.id ? 'accent' : 'neutral'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveView(v.id)}
                  >
                    {v.label}
                  </Badge>
                ))}
              </Group>

              <Spacer />

              {/* Context bar */}
              <Flex align="center" gap={2}>
                <Text
                  size="xs"
                  color="muted"
                  weight="bold"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  Project
                </Text>
                <Badge variant="outline" color="accent">
                  Eldenmoor
                </Badge>
              </Flex>
              <Separator orientation="vertical" style={{ height: 20 }} />
              <Flex align="center" gap={2}>
                <Text
                  size="xs"
                  color="muted"
                  weight="bold"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  Zone
                </Text>
                <Badge variant="outline" color="info">
                  East Marsh
                </Badge>
              </Flex>
              <Separator orientation="vertical" style={{ height: 20 }} />
              <Button size="sm" variant="primary">
                + Entity
              </Button>
            </Group>
          </Box>

          {/* Module content area */}
          <Box p={5} style={{ flex: 1, overflowY: 'auto' }}>
            <Container size="lg">
              <Stack gap={6}>
                {/* Module stat header */}
                <SimpleGrid cols={4} spacing={3}>
                  <StatCard
                    label="Total Entities"
                    value={142}
                    delta="+12"
                    icon="👤"
                    color="accent"
                  />
                  <StatCard label="Canon" value={87} icon="✅" color="success" />
                  <StatCard label="In Review" value={31} icon="👁️" color="warning" />
                  <StatCard label="Drafts" value={24} icon="📝" color="info" />
                </SimpleGrid>

                {/* System health panel */}
                <Grid columns="1fr 320px" gap={4}>
                  {/* Main content */}
                  <Card>
                    <Card.Body>
                      <Stack gap={3}>
                        <Flex align="center" gap={2}>
                          <Text weight="semibold">Recent Entities</Text>
                          <Spacer />
                          <Input placeholder="Filter…" size="sm" style={{ width: 200 }} />
                        </Flex>
                        <Separator />
                        {[
                          'Goblin Chief',
                          'Lady Aldra',
                          'Marsh Wraith',
                          'Iron Golem',
                          'Healing Potion',
                          'Flamebrand',
                        ].map((name, i) => (
                          <Flex
                            key={name}
                            align="center"
                            gap={3}
                            py={1}
                            style={{
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--forge-border-subtle)',
                            }}
                          >
                            <Text size="sm" style={{ opacity: 0.5, width: 20 }}>
                              {['👤', '👤', '👾', '🤖', '🧪', '⚔️'][i]}
                            </Text>
                            <Text size="sm" weight="medium" style={{ flex: 1 }}>
                              {name}
                            </Text>
                            <Badge
                              variant="subtle"
                              color={
                                ['success', 'success', 'neutral', 'warning', 'info', 'success'][
                                  i
                                ] as 'success' | 'neutral' | 'warning' | 'info'
                              }
                            >
                              {['canon', 'canon', 'draft', 'proposed', 'approved', 'canon'][i]}
                            </Badge>
                            <Text size="xs" color="muted">
                              Lv {[12, 20, 8, 15, 1, 10][i]}
                            </Text>
                          </Flex>
                        ))}
                      </Stack>
                    </Card.Body>
                  </Card>

                  {/* Sidebar info */}
                  <Stack gap={3}>
                    <Card>
                      <Card.Body>
                        <Stack gap={3}>
                          <Text weight="semibold">Tool Health</Text>
                          <Separator />
                          <HealthRow
                            name="Entity Store"
                            status="ok"
                            icon="👤"
                            detail="142 artifacts"
                          />
                          <HealthRow name="Schema" status="ok" icon="📐" detail="Valid" />
                          <HealthRow
                            name="Orphan Check"
                            status="warn"
                            icon="🔗"
                            detail="3 orphans"
                          />
                          <HealthRow name="Last Validation" status="ok" icon="✓" detail="2m ago" />
                        </Stack>
                      </Card.Body>
                    </Card>

                    <Card>
                      <Card.Body>
                        <Stack gap={3}>
                          <Text weight="semibold">Quick Actions</Text>
                          <Separator />
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ justifyContent: 'flex-start' }}
                          >
                            + Create Entity
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ justifyContent: 'flex-start' }}
                          >
                            Run Validation
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ justifyContent: 'flex-start' }}
                          >
                            Bulk Promote
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ justifyContent: 'flex-start' }}
                          >
                            Export CSV
                          </Button>
                        </Stack>
                      </Card.Body>
                    </Card>
                  </Stack>
                </Grid>
              </Stack>
            </Container>
          </Box>
        </Stack>
      </Grid>
    )
  },
}

// ---------------------------------------------------------------------------
// 5. World Overview Dashboard — rich command center for game world state
// ---------------------------------------------------------------------------

export const WorldCommandCenter: Story = {
  name: 'World Command Center',
  render: () => {
    const pipelineSteps = [
      { label: 'Init', status: 'completed' as const },
      { label: 'Design', status: 'completed' as const },
      { label: 'Validate', status: 'active' as const },
      { label: 'Build', status: 'pending' as const },
      { label: 'Pack', status: 'pending' as const },
    ]

    return (
      <Stack gap={0} style={{ height: '100vh' }}>
        {/* Top bar */}
        <Box px={6} py={3} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
          <Group gap={3}>
            <Text size="lg" weight="bold" style={{ color: 'var(--forge-accent)' }}>
              ⚒
            </Text>
            <Heading level={3} size="md">
              Eldenmoor — Command Center
            </Heading>
            <Badge variant="subtle" color="info">
              Phase 2: Design & Validation
            </Badge>
            <Spacer />
            <Badge variant="subtle" color="success">
              ● Connected
            </Badge>
            <Separator orientation="vertical" style={{ height: 20 }} />
            <Button size="sm" variant="ghost">
              Project Settings
            </Button>
            <Button size="sm" variant="primary">
              Build All
            </Button>
          </Group>
        </Box>

        <Box p={6} style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap={6}>
            {/* Pipeline progress */}
            <Card>
              <Card.Body>
                <Stack gap={3}>
                  <Flex align="center" gap={2}>
                    <Text weight="semibold">Project Pipeline</Text>
                    <Spacer />
                    <Badge variant="outline" color="accent">
                      Phase 3 of 5
                    </Badge>
                  </Flex>
                  <Box py={2}>
                    <Steps steps={pipelineSteps} />
                  </Box>
                </Stack>
              </Card.Body>
            </Card>

            {/* Stats row */}
            <SimpleGrid cols={5} spacing={3}>
              <StatCard label="Entities" value={142} delta="+12" icon="👤" color="accent" />
              <StatCard label="Quests" value={38} delta="+3" icon="📜" color="info" />
              <StatCard label="Encounters" value={24} icon="⚔️" color="warning" />
              <StatCard label="Zones" value={6} delta="+1" icon="🗺️" color="success" />
              <StatCard label="Locations" value={64} delta="+2" icon="📍" />
            </SimpleGrid>

            {/* Three-column body */}
            <Grid columns="1fr 1fr 320px" gap={4}>
              {/* Activity feed */}
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
                        action: 'Entity promoted',
                        target: 'Goblin Chief → canon',
                        ts: '2m ago',
                        dot: 'var(--forge-success)',
                      },
                      {
                        action: 'Quest created',
                        target: 'The Dark Forge',
                        ts: '15m ago',
                        dot: 'var(--forge-info)',
                      },
                      {
                        action: 'Encounter linked',
                        target: 'east-marsh-ambush × Iron Fortress',
                        ts: '1h ago',
                        dot: 'var(--forge-accent)',
                      },
                      {
                        action: 'Validation failed',
                        target: 'Director orphan refs (2 issues)',
                        ts: '2h ago',
                        dot: 'var(--forge-danger)',
                      },
                      {
                        action: 'Zone packed',
                        target: 'East Marsh → v1.2.0',
                        ts: '3h ago',
                        dot: 'var(--forge-success)',
                      },
                      {
                        action: 'Terrain generated',
                        target: 'Wraith Bog semantic map',
                        ts: '4h ago',
                        dot: 'var(--forge-info)',
                      },
                      {
                        action: 'Canon approved',
                        target: 'Lady Aldra backstory',
                        ts: '5h ago',
                        dot: 'var(--forge-success)',
                      },
                    ].map(({ action, target, ts, dot }) => (
                      <Flex key={target} align="flex-start" gap={3}>
                        <Box
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: dot,
                            flexShrink: 0,
                            marginTop: 6,
                          }}
                        />
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text size="sm">{action}</Text>
                          <Text size="xs" color="muted">
                            {target}
                          </Text>
                        </Stack>
                        <Text size="xs" color="muted" style={{ flexShrink: 0 }}>
                          {ts}
                        </Text>
                      </Flex>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>

              {/* Coverage + balance */}
              <Stack gap={4}>
                <Card>
                  <Card.Body>
                    <Stack gap={3}>
                      <Flex align="center" gap={2}>
                        <Text weight="semibold">Zone Coverage</Text>
                        <Spacer />
                        <Text size="xs" color="muted">
                          2/6 packed
                        </Text>
                      </Flex>
                      <Separator />
                      {ZONE_DATA.slice(0, 4).map((z) => {
                        const pct = Object.values(z.pipeline).filter(Boolean).length * 25
                        return (
                          <Stack key={z.id} gap={1}>
                            <Flex align="center" gap={2}>
                              <Text size="sm" style={{ flex: 1 }}>
                                {z.name}
                              </Text>
                              <Badge
                                variant="subtle"
                                color={
                                  z.lifecycle === 'validated'
                                    ? 'success'
                                    : z.lifecycle === 'designed'
                                      ? 'info'
                                      : 'neutral'
                                }
                                style={{ fontSize: '10px' }}
                              >
                                {z.lifecycle}
                              </Badge>
                              <Text size="xs" color="muted">
                                {z.total} refs
                              </Text>
                            </Flex>
                            <Progress
                              value={pct}
                              variant={pct === 100 ? 'success' : 'default'}
                              size="sm"
                            />
                          </Stack>
                        )
                      })}
                    </Stack>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Stack gap={3}>
                      <Flex align="center" gap={2}>
                        <Text weight="semibold">Lifecycle Breakdown</Text>
                        <Spacer />
                        <Badge variant="subtle" color="accent">
                          {142} total
                        </Badge>
                      </Flex>
                      <Separator />
                      {[
                        { state: 'Canon', count: 87, color: 'var(--forge-success)', pct: 61 },
                        { state: 'Approved', count: 24, color: 'var(--forge-info)', pct: 17 },
                        { state: 'Proposed', count: 15, color: 'var(--forge-warning)', pct: 11 },
                        { state: 'Draft', count: 16, color: 'var(--forge-border)', pct: 11 },
                      ].map((s) => (
                        <Flex key={s.state} align="center" gap={3}>
                          <Box
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 2,
                              backgroundColor: s.color,
                              flexShrink: 0,
                            }}
                          />
                          <Text size="sm" style={{ width: 80 }}>
                            {s.state}
                          </Text>
                          <Box
                            style={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'var(--forge-border)',
                            }}
                          >
                            <Box
                              style={{
                                width: `${s.pct}%`,
                                height: '100%',
                                borderRadius: 3,
                                backgroundColor: s.color,
                                transition: 'width 0.3s',
                              }}
                            />
                          </Box>
                          <Text size="xs" color="muted" style={{ width: 30, textAlign: 'right' }}>
                            {s.count}
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Card.Body>
                </Card>
              </Stack>

              {/* System health + actions */}
              <Stack gap={4}>
                <Card>
                  <Card.Body>
                    <Stack gap={3}>
                      <Text weight="semibold">System Health</Text>
                      <Separator />
                      <HealthRow name="Entity Store" status="ok" icon="👤" detail="142 artifacts" />
                      <HealthRow name="Quest Engine" status="ok" icon="📜" detail="38 artifacts" />
                      <HealthRow name="Encounters" status="warn" icon="⚔️" detail="1 CR mismatch" />
                      <HealthRow name="Director" status="error" icon="🎬" detail="2 orphan refs" />
                      <HealthRow name="Rules Engine" status="ok" icon="📐" detail="Valid" />
                      <HealthRow name="Terrain Gen" status="ok" icon="🏔️" detail="4 maps ready" />
                      <HealthRow
                        name="Asset Pipeline"
                        status="running"
                        icon="🎨"
                        detail="Generating…"
                      />
                    </Stack>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Stack gap={2}>
                      <Text weight="semibold">Quick Actions</Text>
                      <Separator />
                      <Button variant="ghost" size="sm" style={{ justifyContent: 'flex-start' }}>
                        + New Zone
                      </Button>
                      <Button variant="ghost" size="sm" style={{ justifyContent: 'flex-start' }}>
                        Import Entities
                      </Button>
                      <Button variant="ghost" size="sm" style={{ justifyContent: 'flex-start' }}>
                        Run Full Validation
                      </Button>
                      <Button variant="ghost" size="sm" style={{ justifyContent: 'flex-start' }}>
                        Export Data Pack
                      </Button>
                      <Separator />
                      <Button variant="danger" size="sm" style={{ justifyContent: 'flex-start' }}>
                        Reset Pipeline
                      </Button>
                    </Stack>
                  </Card.Body>
                </Card>
              </Stack>
            </Grid>
          </Stack>
        </Box>
      </Stack>
    )
  },
}
