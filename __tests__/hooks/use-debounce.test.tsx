import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from '@/hooks/use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('does not update the value before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    rerender({ value: 'updated', delay: 300 })
    expect(result.current).toBe('initial')
  })

  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    rerender({ value: 'updated', delay: 300 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('updated')
  })

  it('resets the timer when value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    rerender({ value: 'first-update', delay: 300 })
    act(() => { vi.advanceTimersByTime(150) })
    expect(result.current).toBe('initial')

    rerender({ value: 'second-update', delay: 300 })
    act(() => { vi.advanceTimersByTime(150) })
    expect(result.current).toBe('initial')

    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe('second-update')
  })

  it('works with numeric values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 200 } }
    )

    rerender({ value: 42, delay: 200 })
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(42)
  })

  it('works with object values', () => {
    const initialObj = { query: 'initial' }
    const updatedObj = { query: 'updated' }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 300 } }
    )

    rerender({ value: updatedObj, delay: 300 })
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toEqual(updatedObj)
  })

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    rerender({ value: 'updated', delay: 300 })
    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
