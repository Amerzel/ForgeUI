import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Timeline, Button, Text, Badge } from '@forgeui/components'
import type { TimelineTrack } from '@forgeui/components'

const meta: Meta = {
  title: 'Domain/Timeline',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Multi-track timeline editor for animation sequences, cutscenes, and audio.' } },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

const ANIMATION_TRACKS: TimelineTrack[] = [
  {
    id: 'camera',
    label: '🎥 Camera',
    clips: [
      { id: 'cam-intro', start: 0,   duration: 3.5, label: 'Intro dolly',  color: 'var(--forge-accent)' },
      { id: 'cam-pan',   start: 4,   duration: 2.0, label: 'Pan right',    color: 'var(--forge-accent)' },
      { id: 'cam-close', start: 7,   duration: 3.0, label: 'Close-up',     color: 'var(--forge-accent)' },
    ],
  },
  {
    id: 'player',
    label: '🧑 Player Anim',
    clips: [
      { id: 'ply-idle',  start: 0,   duration: 1.5, label: 'Idle',         color: 'var(--forge-success)' },
      { id: 'ply-walk',  start: 1.5, duration: 3.0, label: 'Walk forward', color: 'var(--forge-success)' },
      { id: 'ply-atk',   start: 5,   duration: 2.5, label: 'Attack combo', color: 'var(--forge-warning)' },
      { id: 'ply-idle2', start: 8,   duration: 2.0, label: 'Idle',         color: 'var(--forge-success)' },
    ],
  },
  {
    id: 'vfx',
    label: '✨ VFX',
    clips: [
      { id: 'vfx-dust',  start: 1.5, duration: 1.0, label: 'Footstep dust', color: 'var(--forge-text-muted)' },
      { id: 'vfx-spark', start: 5.2, duration: 0.8, label: 'Sword sparks',  color: 'var(--forge-warning)' },
      { id: 'vfx-blood', start: 5.8, duration: 1.5, label: 'Hit impact',    color: 'var(--forge-danger)' },
    ],
  },
  {
    id: 'audio',
    label: '🔊 Audio',
    clips: [
      { id: 'sfx-amb',   start: 0,   duration: 10.0, label: 'Ambience loop', color: 'var(--forge-surface-raised)' },
      { id: 'sfx-foot',  start: 1.5, duration: 3.0,  label: 'Footsteps',     color: 'var(--forge-text-muted)' },
      { id: 'sfx-sword', start: 5.0, duration: 2.0,  label: 'Sword swing',   color: 'var(--forge-text-muted)' },
    ],
  },
]

export const AnimationSequence: Story = {
  name: 'Animation Sequence',
  render: function TimelineDemo() {
    const [currentTime, setCurrentTime] = useState(0)
    const [tracks, setTracks] = useState(ANIMATION_TRACKS)
    const [playing, setPlaying] = useState(false)
    const duration = 10

    const togglePlay = () => {
      setPlaying(p => !p)
      if (!playing) {
        const start = Date.now() - currentTime * 1000
        const tick = () => {
          const elapsed = (Date.now() - start) / 1000
          if (elapsed >= duration) { setCurrentTime(duration); setPlaying(false); return }
          setCurrentTime(elapsed)
          requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant={playing ? 'danger' : 'primary'} size="sm" onClick={togglePlay}>
            {playing ? '⏹ Stop' : '▶ Play'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentTime(0)}>⏮ Reset</Button>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', fontFamily: 'var(--forge-font-mono)' }}>
            {String(Math.floor(currentTime / 60)).padStart(1, '0')}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}.{String(Math.floor((currentTime % 1) * 10))}
            <span style={{ color: 'var(--forge-border)' }}> / 0:10.0</span>
          </Text>
          <Badge style={{ marginLeft: 'auto' }}>4 tracks · 11 clips</Badge>
        </div>
        <div style={{ height: '240px' }}>
          <Timeline
            tracks={tracks}
            currentTime={currentTime}
            duration={duration}
            onSeek={setCurrentTime}
            onClipChange={(trackId, clip) => {
              setTracks(prev => prev.map(t =>
                t.id === trackId
                  ? { ...t, clips: t.clips.map(c => c.id === clip.id ? clip : c) }
                  : t
              ))
            }}
          />
        </div>
        <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
          Drag clips to reposition · Drag clip edges to resize · Drag ruler to seek
        </Text>
      </div>
    )
  },
}
