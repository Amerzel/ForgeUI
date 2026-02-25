import type { HTMLAttributes } from 'react'

export type SpacerProps = HTMLAttributes<HTMLDivElement>

/**
 * Fills remaining flex/grid space between siblings.
 * Use inside Flex or Group to push items to opposite ends.
 *
 * @example
 * <Flex>
 *   <Logo />
 *   <Spacer />
 *   <Button>Sign In</Button>
 * </Flex>
 */
export function Spacer({ style, ...props }: SpacerProps) {
  return <div style={{ flex: '1 1', alignSelf: 'stretch', ...style }} {...props} />
}
