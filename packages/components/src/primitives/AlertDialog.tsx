import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import { usePortalContainer } from '@forgeui/hooks'
import { Button } from './Button.js'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Dialog title — rendered as a visible heading */
  title: string
  /** Descriptive message explaining the action */
  description?: string
  /** Label for the confirm button. Default: 'Confirm' */
  confirmLabel?: string
  /** Label for the cancel button. Default: 'Cancel' */
  cancelLabel?: string
  /** Called when the user confirms the action */
  onConfirm: () => void
  /** Called when the user cancels. Default: closes the dialog */
  onCancel?: () => void
  /** When true, the confirm button uses danger styling */
  destructive?: boolean
}

/**
 * Confirmation dialog for destructive or irreversible actions.
 * Blocks all interaction behind a modal backdrop until confirmed or cancelled.
 * Focus is trapped inside the dialog until it closes.
 */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}: AlertDialogProps) {
  const portalContainer = usePortalContainer()
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <RadixAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixAlertDialog.Portal container={portalContainer}>
        <RadixAlertDialog.Overlay
          style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'var(--forge-bg-overlay)',
            backdropFilter: `blur(var(--forge-blur-overlay))`,
            zIndex: 'var(--forge-z-modal)',
            animation: `forge-overlay-in var(--forge-duration-normal) var(--forge-easing-default)`,
          }}
        />
        <RadixAlertDialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 'var(--forge-z-modal)',
            width: '100%',
            maxWidth: 'var(--forge-max-w-sm)',
            backgroundColor: 'var(--forge-surface-raised)',
            border: '1px solid var(--forge-border)',
            borderRadius: 'var(--forge-radius-lg)',
            boxShadow: 'var(--forge-shadow-xl)',
            padding: 'var(--forge-space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--forge-space-4)',
            animation: `forge-dialog-in var(--forge-duration-normal) var(--forge-easing-default)`,
          }}
        >
          <RadixAlertDialog.Title
            style={{
              margin: '0',
              fontFamily: 'var(--forge-font-display)',
              fontSize: 'var(--forge-font-size-lg)',
              fontWeight: 'var(--forge-font-semibold)',
              lineHeight: 'var(--forge-line-height-lg)',
              color: 'var(--forge-text)',
            }}
          >
            {title}
          </RadixAlertDialog.Title>

          <RadixAlertDialog.Description
            style={{
              margin: '0',
              fontSize: 'var(--forge-font-size-sm)',
              lineHeight: 'var(--forge-line-height-sm)',
              color: 'var(--forge-text-muted)',
              // Hidden via VisuallyHidden styles when no description provided
              ...(description ? {} : {
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: '0',
              }),
            }}
          >
            {description ?? title}
          </RadixAlertDialog.Description>

          <div style={{ display: 'flex', gap: 'var(--forge-space-2)', justifyContent: 'flex-end' }}>
            <RadixAlertDialog.Cancel asChild>
              <Button variant="ghost" onClick={handleCancel}>
                {cancelLabel}
              </Button>
            </RadixAlertDialog.Cancel>
            <RadixAlertDialog.Action asChild>
              <Button variant={destructive ? 'danger' : 'primary'} onClick={handleConfirm}>
                {confirmLabel}
              </Button>
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>

      <style>{`
        @keyframes forge-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes forge-dialog-in {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </RadixAlertDialog.Root>
  )
}
