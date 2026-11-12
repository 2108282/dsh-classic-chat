import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * lib/client.js is a vendored artifact, so its rc.2 compatibility shims are not
 * covered by the source suite. These assertions keep the shipped bundle honest:
 * rc.2 removed `useAnchoredPosition` from the shared client primitives, and an
 * unshimmed call throws inside the `conversation.composer.bar` slot entry, which
 * silently removes the composer input box.
 */
const bundle = readFileSync('lib/client.js', 'utf8')

describe('vendored client bundle: rc.2 anchoring compatibility', () => {
  it('ships the local useAnchoredPosition fallback', () => {
    expect(bundle).toContain('function _dshCreateAnchoredPositionHook(react, primitives)')
    expect(bundle).toContain('typeof primitives.useAnchoredPosition === "function"')
  })

  it('binds the shim in both vendored modules', () => {
    const bindings = bundle.match(/const _dshUseAnchoredPosition = _dshCreateAnchoredPositionHook\(react, _deepseek_ai_dsh_client_ui_primitives\);/g) ?? []
    expect(bindings).toHaveLength(2)
  })

  it('never calls the removed primitive export directly', () => {
    expect(bundle).not.toContain('_deepseek_ai_dsh_client_ui_primitives.useAnchoredPosition)(')
  })

  it('runs the bundle once per page so rc.2 cannot register its module ids twice', () => {
    expect(bundle).toContain('if (globalThis.__dshClassicChatBundleLoaded !== true) {')
    expect(bundle.trimEnd().endsWith('}')).toBe(true)
  })
})

describe('vendored client bundle: rc.2 document paste route', () => {
  it('ships the shared paste router', () => {
    expect(bundle).toContain('function createComposerFileIntake()')
    expect(bundle).toContain('const fileIntake = createComposerFileIntake();')
  })

  it('joins the route from the composer bar with its occurrence', () => {
    expect(bundle).toContain('occurrence: props.variant,')
    expect(bundle.match(/registerFileIntake: fileIntake,/g) ?? []).toHaveLength(2)
    expect(bundle).toContain('if (typeof registerFileIntake !== "function" || cardRef.current === null) return;')
  })
})
