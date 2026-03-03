import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  EntityCard,
  FilterBar,
  DiffViewer,
  ApprovalPanel,
  MiniMap,
  StatCard,
  HealthRow,
  SectionHeader,
  NavItem,
  Badge,
  Button,
  Text,
  Heading,
  Separator,
} from '@forgeui/components'
import type { FilterDefinition, FilterState } from '@forgeui/components'

const meta: Meta = {
  title: 'Layout/Lore Patterns',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Full-page compositions inspired by ForgeLore — a worldbuilding platform with knowledge graphs, wiki editing, and AI-assisted consistency checking.',
      },
    },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const ENTITIES = [
  {
    id: '1',
    name: 'Gandalf the Grey',
    type: 'Character',
    typeIcon: '🧙',
    status: 'Canon',
    statusColor: 'var(--forge-success)',
    description: 'A wizard of the Istari order, sent to Middle-earth.',
    tags: ['wizard', 'istari', 'fellowship'],
  },
  {
    id: '2',
    name: 'Mordor',
    type: 'Location',
    typeIcon: '🏔',
    status: 'Canon',
    statusColor: 'var(--forge-success)',
    description: 'The dark land ruled by Sauron in the southeast of Middle-earth.',
    tags: ['evil', 'volcanic'],
  },
  {
    id: '3',
    name: 'The One Ring',
    type: 'Item',
    typeIcon: '💍',
    status: 'Canon',
    statusColor: 'var(--forge-success)',
    description: 'The master ring forged by Sauron to control all other rings of power.',
    tags: ['artifact', 'evil'],
  },
  {
    id: '4',
    name: "Battle of Helm's Deep",
    type: 'Event',
    typeIcon: '⚔️',
    status: 'Canon',
    statusColor: 'var(--forge-success)',
    description: 'A major battle during the War of the Ring.',
    tags: ['war', 'rohan'],
  },
  {
    id: '5',
    name: 'Frodo Baggins',
    type: 'Character',
    typeIcon: '🧑',
    status: 'Draft',
    statusColor: 'var(--forge-warning)',
    description: 'A hobbit of the Shire who carried the One Ring to Mount Doom.',
    tags: ['hobbit', 'fellowship'],
  },
  {
    id: '6',
    name: 'Rivendell',
    type: 'Location',
    typeIcon: '🏛',
    status: 'Canon',
    statusColor: 'var(--forge-success)',
    description: 'An Elven outpost in eastern Eriador.',
    tags: ['elvish', 'sanctuary'],
  },
  {
    id: '7',
    name: 'The Fellowship',
    type: 'Faction',
    typeIcon: '🤝',
    status: 'Draft',
    statusColor: 'var(--forge-warning)',
    description: 'Nine companions sworn to destroy the One Ring.',
    tags: ['alliance', 'quest'],
  },
]

// ---------------------------------------------------------------------------
// Story 1: Knowledge Graph Explorer
// ---------------------------------------------------------------------------

const GRAPH_FILTERS: FilterDefinition[] = [
  {
    id: 'type',
    label: 'Entity Type',
    type: 'multi-select',
    options: [
      { value: 'character', label: 'Character', count: 24 },
      { value: 'location', label: 'Location', count: 18 },
      { value: 'event', label: 'Event', count: 12 },
      { value: 'item', label: 'Item', count: 8 },
      { value: 'faction', label: 'Faction', count: 6 },
    ],
  },
  {
    id: 'canon',
    label: 'Canon State',
    type: 'single-select',
    options: [
      { value: 'canon', label: 'Canon' },
      { value: 'draft', label: 'Draft' },
      { value: 'proposed', label: 'Proposed' },
    ],
  },
  { id: 'connected', label: 'Connected Only', type: 'boolean' },
]

export const KnowledgeGraphExplorer: Story = {
  name: 'Knowledge Graph Explorer',
  render: function GraphExplorer() {
    const [filters, setFilters] = useState<FilterState>({})
    const [selectedEntity, setSelectedEntity] = useState<string | null>('1')
    const selected = ENTITIES.find((e) => e.id === selectedEntity)

    return (
      <div style={{ display: 'flex', height: '600px', backgroundColor: 'var(--forge-bg)' }}>
        {/* Left: Filter sidebar */}
        <div
          style={{
            width: '260px',
            borderRight: '1px solid var(--forge-border)',
            padding: 'var(--forge-space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--forge-space-3)',
            overflow: 'auto',
          }}
        >
          <SectionHeader>Filters</SectionHeader>
          <FilterBar filters={GRAPH_FILTERS} value={filters} onChange={setFilters} />

          <Separator />

          <SectionHeader action={<Badge>{ENTITIES.length}</Badge>}>Entities</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-2)' }}>
            {ENTITIES.map((e) => (
              <EntityCard
                key={e.id}
                name={e.name}
                type={e.type}
                typeIcon={e.typeIcon}
                status={e.status}
                statusColor={e.statusColor}
                selected={selectedEntity === e.id}
                onClick={() => setSelectedEntity(e.id)}
              />
            ))}
          </div>
        </div>

        {/* Center: Graph canvas placeholder */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              padding: 'var(--forge-space-2) var(--forge-space-3)',
              borderBottom: '1px solid var(--forge-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--forge-space-2)',
            }}
          >
            <Text size="sm" style={{ fontWeight: 500 }}>
              World Graph — Middle-earth
            </Text>
            <Badge>68 entities · 142 relationships</Badge>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="sm">
              Fit View
            </Button>
            <Button variant="ghost" size="sm">
              Reset
            </Button>
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--forge-surface)',
              position: 'relative',
            }}
          >
            {/* Simulated graph nodes */}
            <svg width="100%" height="100%" viewBox="0 0 600 400" style={{ opacity: 0.6 }}>
              {/* Edges */}
              <line
                x1="300"
                y1="120"
                x2="180"
                y2="250"
                stroke="var(--forge-border)"
                strokeWidth="1.5"
              />
              <line
                x1="300"
                y1="120"
                x2="420"
                y2="200"
                stroke="var(--forge-border)"
                strokeWidth="1.5"
              />
              <line
                x1="300"
                y1="120"
                x2="300"
                y2="300"
                stroke="var(--forge-accent)"
                strokeWidth="2"
              />
              <line
                x1="180"
                y1="250"
                x2="300"
                y2="300"
                stroke="var(--forge-border)"
                strokeWidth="1.5"
              />
              <line
                x1="420"
                y1="200"
                x2="500"
                y2="300"
                stroke="var(--forge-border)"
                strokeWidth="1.5"
              />
              <line
                x1="100"
                y1="150"
                x2="180"
                y2="250"
                stroke="var(--forge-border)"
                strokeWidth="1.5"
              />
              {/* Nodes */}
              <circle cx="300" cy="120" r="20" fill="var(--forge-accent)" opacity="0.8" />
              <text x="300" y="125" textAnchor="middle" fill="var(--forge-bg)" fontSize="14">
                🧙
              </text>
              <circle cx="180" cy="250" r="16" fill="var(--forge-success)" opacity="0.6" />
              <text x="180" y="255" textAnchor="middle" fill="var(--forge-bg)" fontSize="12">
                🏔
              </text>
              <circle cx="420" cy="200" r="16" fill="var(--forge-warning)" opacity="0.6" />
              <text x="420" y="205" textAnchor="middle" fill="var(--forge-bg)" fontSize="12">
                💍
              </text>
              <circle cx="300" cy="300" r="14" fill="var(--forge-danger)" opacity="0.6" />
              <text x="300" y="305" textAnchor="middle" fill="var(--forge-bg)" fontSize="11">
                ⚔️
              </text>
              <circle cx="500" cy="300" r="14" fill="var(--forge-success)" opacity="0.6" />
              <text x="500" y="305" textAnchor="middle" fill="var(--forge-bg)" fontSize="11">
                🏛
              </text>
              <circle cx="100" cy="150" r="14" fill="var(--forge-warning)" opacity="0.6" />
              <text x="100" y="155" textAnchor="middle" fill="var(--forge-bg)" fontSize="11">
                🧑
              </text>
            </svg>

            {/* MiniMap overlay */}
            <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
              <MiniMap
                contentWidth={600}
                contentHeight={400}
                viewport={{ x: 50, y: 50, width: 500, height: 300 }}
                width={150}
                height={100}
              />
            </div>
          </div>
        </div>

        {/* Right: Entity inspector */}
        {selected && (
          <div
            style={{
              width: '300px',
              borderLeft: '1px solid var(--forge-border)',
              padding: 'var(--forge-space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--forge-space-3)',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
              <span style={{ fontSize: '24px' }}>{selected.typeIcon}</span>
              <div>
                <Heading level={3} size="sm">
                  {selected.name}
                </Heading>
                <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                  {selected.type}
                </Text>
              </div>
            </div>
            <Badge
              style={{
                alignSelf: 'flex-start',
                backgroundColor: `color-mix(in srgb, ${selected.statusColor} 15%, transparent)`,
                color: selected.statusColor,
              }}
            >
              {selected.status}
            </Badge>
            <Separator />
            <SectionHeader>Description</SectionHeader>
            <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>
              {selected.description}
            </Text>
            <SectionHeader>Tags</SectionHeader>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--forge-space-1)' }}>
              {selected.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <SectionHeader>Relationships</SectionHeader>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
              3 connections · 2 incoming · 1 outgoing
            </Text>
          </div>
        )}
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 2: Wiki Editor
// ---------------------------------------------------------------------------

export const WikiEditor: Story = {
  name: 'Wiki Editor',
  render: function WikiEditorDemo() {
    const [selectedEntity, setSelectedEntity] = useState('1')
    const selected = ENTITIES.find((e) => e.id === selectedEntity)

    return (
      <div style={{ display: 'flex', height: '600px', backgroundColor: 'var(--forge-bg)' }}>
        {/* Left: Entity list */}
        <div
          style={{
            width: '280px',
            borderRight: '1px solid var(--forge-border)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: 'var(--forge-space-3)',
              borderBottom: '1px solid var(--forge-border)',
            }}
          >
            <div
              style={{
                padding: 'var(--forge-space-2)',
                backgroundColor: 'var(--forge-surface)',
                border: '1px solid var(--forge-border)',
                borderRadius: 'var(--forge-radius-sm)',
                fontSize: 'var(--forge-font-size-xs)',
                color: 'var(--forge-text-muted)',
              }}
            >
              🔍 Search entities…
            </div>
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: 'var(--forge-space-2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--forge-space-1)',
            }}
          >
            {ENTITIES.map((e) => (
              <EntityCard
                key={e.id}
                name={e.name}
                type={e.type}
                typeIcon={e.typeIcon}
                status={e.status}
                statusColor={e.statusColor}
                selected={selectedEntity === e.id}
                onClick={() => setSelectedEntity(e.id)}
              />
            ))}
          </div>
        </div>

        {/* Center: Editor area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: 'var(--forge-space-2) var(--forge-space-3)',
              borderBottom: '1px solid var(--forge-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--forge-space-2)',
            }}
          >
            <span style={{ fontSize: '18px' }}>{selected?.typeIcon}</span>
            <Heading level={3} size="sm">
              {selected?.name ?? 'Select an entity'}
            </Heading>
            {selected && <Badge>{selected.status}</Badge>}
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="sm">
              History
            </Button>
            <Button variant="primary" size="sm">
              Save
            </Button>
          </div>
          <div style={{ flex: 1, padding: 'var(--forge-space-4)', overflow: 'auto' }}>
            {/* Simulated rich text editor */}
            <div
              style={{
                maxWidth: '700px',
                margin: '0 auto',
                color: 'var(--forge-text)',
                fontSize: 'var(--forge-font-size-base)',
                lineHeight: '1.7',
              }}
            >
              <p style={{ marginBottom: 'var(--forge-space-3)' }}>{selected?.description}</p>
              <p style={{ color: 'var(--forge-text-muted)', marginBottom: 'var(--forge-space-3)' }}>
                This is where the TipTap rich text editor would render. Users can write long-form
                content with markdown formatting,{' '}
                <span style={{ color: 'var(--forge-accent)', textDecoration: 'underline' }}>
                  @entity mentions
                </span>
                , and collaborative editing via Yjs.
              </p>
              <div
                style={{
                  padding: 'var(--forge-space-3)',
                  backgroundColor: 'var(--forge-surface)',
                  borderRadius: 'var(--forge-radius-md)',
                  border: '1px solid var(--forge-border)',
                  fontFamily: 'var(--forge-font-mono)',
                  fontSize: 'var(--forge-font-size-xs)',
                  color: 'var(--forge-text-muted)',
                }}
              >
                💡 Editor toolbar: Bold · Italic · Heading · Link · @Mention · Code · Image · Table
              </div>
            </div>
          </div>
        </div>

        {/* Right: Relationships panel */}
        <div
          style={{
            width: '280px',
            borderLeft: '1px solid var(--forge-border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              padding: 'var(--forge-space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--forge-space-3)',
            }}
          >
            <SectionHeader
              action={
                <Button variant="ghost" size="sm">
                  + Add
                </Button>
              }
            >
              Relationships
            </SectionHeader>
            <EntityCard
              name="The One Ring"
              type="carries"
              typeIcon="💍"
              description="The burden of the ring-bearer"
            />
            <EntityCard
              name="The Fellowship"
              type="member of"
              typeIcon="🤝"
              description="One of the nine companions"
            />
            <EntityCard
              name="Rivendell"
              type="visited"
              typeIcon="🏛"
              description="Attended the Council of Elrond"
            />

            <Separator />

            <SectionHeader>Metadata</SectionHeader>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '4px var(--forge-space-2)',
                fontSize: 'var(--forge-font-size-xs)',
              }}
            >
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                Created
              </Text>
              <Text size="xs">Feb 14, 2026</Text>
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                Modified
              </Text>
              <Text size="xs">Feb 27, 2026</Text>
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                Visibility
              </Text>
              <Text size="xs">Public</Text>
              <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
                Version
              </Text>
              <Text size="xs">v3</Text>
            </div>

            <Separator />

            <SectionHeader>Tags</SectionHeader>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--forge-space-1)' }}>
              {selected?.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 3: World Dashboard
// ---------------------------------------------------------------------------

export const WorldDashboard: Story = {
  name: 'World Dashboard',
  render: () => (
    <div
      style={{
        padding: 'var(--forge-space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--forge-space-4)',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <div>
        <Heading level={2} size="lg">
          Middle-earth
        </Heading>
        <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>
          World Dashboard · Last updated 2 hours ago
        </Text>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--forge-space-3)',
        }}
      >
        <StatCard label="Entities" value="68" delta="+4" icon="📜" color="accent" />
        <StatCard label="Relationships" value="142" delta="+12" icon="🔗" color="info" />
        <StatCard label="Canon" value="52" icon="✅" color="success" />
        <StatCard label="Drafts" value="16" delta="+4" icon="📝" color="warning" />
        <StatCard label="Findings" value="3" icon="⚠️" color="danger" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--forge-space-4)' }}>
        {/* Recent activity */}
        <div>
          <SectionHeader
            action={
              <Button variant="ghost" size="sm">
                View All
              </Button>
            }
          >
            Recent Activity
          </SectionHeader>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--forge-space-2)',
              marginTop: 'var(--forge-space-2)',
            }}
          >
            <EntityCard
              name="Gandalf the Grey"
              type="Character"
              typeIcon="🧙"
              description="Updated description and relationships"
              status="Modified"
              statusColor="var(--forge-accent)"
            />
            <EntityCard
              name="Battle of Pelennor"
              type="Event"
              typeIcon="⚔️"
              description="New entity created"
              status="Created"
              statusColor="var(--forge-success)"
            />
            <EntityCard
              name="Frodo Baggins"
              type="Character"
              typeIcon="🧑"
              description="Promoted from Draft to Canon"
              status="Promoted"
              statusColor="var(--forge-success)"
            />
          </div>
        </div>

        {/* System health + quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-3)' }}>
          <SectionHeader>System Health</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-1)' }}>
            <HealthRow name="Graph Database" status="ok" detail="Connected · 4ms" icon="🗄" />
            <HealthRow name="Search Index" status="ok" detail="68 documents" icon="🔍" />
            <HealthRow
              name="Consistency Agent"
              status="running"
              detail="Checking 3 entities"
              icon="🤖"
            />
            <HealthRow name="LLM Provider" status="warn" detail="Rate limited" icon="🧠" />
            <HealthRow name="Collaboration" status="ok" detail="2 active sessions" icon="👥" />
          </div>

          <SectionHeader>Quick Actions</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-1)' }}>
            <NavItem label="Open Wiki" icon="📖" />
            <NavItem label="View Graph" icon="🕸" />
            <NavItem label="Timeline" icon="⏱" />
            <NavItem label="Run Consistency Check" icon="🔍" />
            <NavItem label="Export World" icon="📦" />
          </div>
        </div>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Story 4: Approval Workflow
// ---------------------------------------------------------------------------

const BEFORE_TEXT = `## Gandalf the Grey

**Race:** Maia (Istari)
**Age:** Unknown, possibly 2000+ years
**Affiliation:** The Istari Order

Gandalf is one of the five Istari sent to Middle-earth by the Valar.
He is known for his wisdom and his guidance of the Free Peoples.`

const AFTER_TEXT = `## Gandalf the Grey (later Gandalf the White)

**Race:** Maia (Istari)
**Age:** Approximately 11,000 years (since creation as a Maia)
**Affiliation:** The Istari Order, The Fellowship of the Ring

Gandalf is one of the five Istari sent to Middle-earth by the Valar
in the Third Age. He is known for his wisdom, his fireworks, and his
pivotal role in the War of the Ring. After falling in Moria, he was
sent back as Gandalf the White with enhanced powers.`

export const ApprovalWorkflow: Story = {
  name: 'Approval Workflow',
  render: function ApprovalWorkflowDemo() {
    const [findings] = useState([
      {
        id: '1',
        title: "Update Gandalf's age",
        entity: 'Gandalf the Grey',
        severity: 'major',
        description:
          'AI agent proposes updating character age based on cross-references with Silmarillion lore.',
      },
      {
        id: '2',
        title: 'Add Fellowship affiliation',
        entity: 'Gandalf the Grey',
        severity: 'minor',
        description: 'Missing faction relationship detected.',
      },
      {
        id: '3',
        title: 'Temporal inconsistency',
        entity: "Battle of Helm's Deep",
        severity: 'critical',
        description: 'Event date conflicts with the timeline of Rohan.',
      },
    ])
    const [selectedFinding, setSelectedFinding] = useState('1')
    const currentFinding = findings.find((f) => f.id === selectedFinding)

    return (
      <div style={{ display: 'flex', height: '600px', backgroundColor: 'var(--forge-bg)' }}>
        {/* Left: Findings list */}
        <div
          style={{
            width: '320px',
            borderRight: '1px solid var(--forge-border)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: 'var(--forge-space-3)',
              borderBottom: '1px solid var(--forge-border)',
            }}
          >
            <SectionHeader action={<Badge>3 findings</Badge>}>Consistency Review</SectionHeader>
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: 'var(--forge-space-2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--forge-space-2)',
            }}
          >
            {findings.map((f) => (
              <EntityCard
                key={f.id}
                name={f.title}
                type={f.entity}
                typeIcon={f.severity === 'critical' ? '🔴' : f.severity === 'major' ? '🟡' : '🔵'}
                description={f.description}
                status={f.severity}
                statusColor={
                  f.severity === 'critical'
                    ? 'var(--forge-danger)'
                    : f.severity === 'major'
                      ? 'var(--forge-warning)'
                      : 'var(--forge-accent)'
                }
                selected={selectedFinding === f.id}
                onClick={() => setSelectedFinding(f.id)}
              />
            ))}
          </div>
        </div>

        {/* Right: Diff + Approval */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div
            style={{
              padding: 'var(--forge-space-3)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--forge-space-3)',
            }}
          >
            {currentFinding && (
              <ApprovalPanel
                title={currentFinding.title}
                description={currentFinding.description}
                status="pending"
                onApprove={(r) => console.log('Approved:', r)}
                onReject={(r) => console.log('Rejected:', r)}
              >
                <DiffViewer
                  before={BEFORE_TEXT}
                  after={AFTER_TEXT}
                  mode="unified"
                  beforeLabel="Current"
                  afterLabel="Proposed"
                />
              </ApprovalPanel>
            )}
          </div>
        </div>
      </div>
    )
  },
}
