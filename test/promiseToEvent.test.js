import { strictEqual } from 'node:assert'
import { setTimeout } from 'node:timers/promises'
import { describe, it } from 'mocha'
import promiseToEvent from '../promiseToEvent.js'

describe('promiseToEvent', () => {
  it('should be a function', () => {
    strictEqual(typeof promiseToEvent, 'function')
  })

  it('should return an EventEmitter object', () => {
    const result = promiseToEvent(new Promise(() => {}))

    strictEqual(typeof result.emit, 'function')
    strictEqual(typeof result.on, 'function')
  })

  it('should emit an end event on resolve', async () => {
    let touched
    const result = promiseToEvent(setTimeout(10))

    result.on('end', () => {
      touched = true
    })

    await setTimeout(20)

    strictEqual(touched, true)
  })

  it('should emit an error event on reject', async () => {
    let touched

    const func = async () => {
      await setTimeout(10)
      throw new Error('test')
    }

    const result = promiseToEvent(func())

    result.on('error', () => {
      touched = true
    })

    await setTimeout(20)

    strictEqual(touched, true)
  })

  it('should forward the emitted error', async () => {
    let error

    const func = async () => {
      await setTimeout(10)
      throw new Error('test')
    }

    const result = promiseToEvent(func())

    result.on('error', err => {
      error = err
    })

    await setTimeout(20)

    strictEqual(error.message, 'test')
  })
})
