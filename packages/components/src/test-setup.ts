import '@testing-library/jest-dom'
import { expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

// jsdom doesn't implement ResizeObserver — mock it for Radix Slider and similar
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom doesn't implement scrollIntoView — mock it for cmdk
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

// jsdom doesn't implement hasPointerCapture — mock it for Radix Toast swipe handling
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}
