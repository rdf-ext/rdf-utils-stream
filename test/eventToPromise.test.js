import { doesNotReject, rejects, strictEqual } from 'node:assert'
import { EventEmitter } from 'events' // eslint-disable-line import/order
import { describe, it } from 'mocha'
import eventToPromise from '../eventToPromise.js'

describe('eventToPromise', () => {
  it('should be a function', () => {
    strictEqual(typeof eventToPromise, 'function')
  })

  it('should resolve on end event', async () => {
    const event = new EventEmitter()

    await doesNotReject(async () => {
      setTimeout(() => {
        event.emit('end')
      }, 10)

      await eventToPromise(event)
    })
  })

  it('should reject on error event', async () => {
    const event = new EventEmitter()

    await rejects(async () => {
      setTimeout(() => {
        event.emit('error')
      }, 10)

      await eventToPromise(event)
    })
  })

  it('should forward the error from the error event', async () => {
    const event = new EventEmitter()

    await rejects(async () => {
      setTimeout(() => {
        event.emit('error', new Error('test'))
      }, 10)

      await eventToPromise(event)
    }, { message: 'test' })
  })
})
