import {
  flashMessage,
  flashErrorMessage,
} from '../src'

jest.useFakeTimers()

const dispatchIntoArray = (arr) => {
  return (action) => {
    arr.push(action.type)
  }
}

test('flashMessage with push option sends clearMessages event', () => {
  const dispatchedTypes = []
  const dispatch = dispatchIntoArray(dispatchedTypes)
  flashMessage('Hi', {
    push: true,
  })(dispatch)
  expect(dispatchedTypes).toEqual(['CLEAR_MESSAGES', 'ADD_FLASH'])
})

test('flashMessage sets default timeout if none is provided', () => {
  const dispatchedTypes = []
  const dispatch = dispatchIntoArray(dispatchedTypes)
  flashMessage('Hi')(dispatch)
  expect(dispatchedTypes).toEqual(['ADD_FLASH'])
  jest.runTimersToTime(4000)
  expect(dispatchedTypes).toEqual(['ADD_FLASH', 'REMOVE_FLASH'])
})

test('flashMessage sets custom timeout if one is provided', () => {
  const dispatchedTypes = []
  const dispatch = dispatchIntoArray(dispatchedTypes)
  flashMessage('Hi', { timeout: 500 })(dispatch)
  expect(dispatchedTypes).toEqual(['ADD_FLASH'])
  jest.runTimersToTime(1000)
  expect(dispatchedTypes).toEqual(['ADD_FLASH', 'REMOVE_FLASH'])
})

test('flashMessage sets no timeout if "false" is provided', () => {
  const dispatchedTypes = []
  const dispatch = dispatchIntoArray(dispatchedTypes)
  flashMessage('Hi', { timeout: false })(dispatch)
  expect(dispatchedTypes).toEqual(['ADD_FLASH'])
  jest.runTimersToTime(4000)
  expect(dispatchedTypes).toEqual(['ADD_FLASH'])
})

test('flasMessage passes message, isError and props to action', () => {
  const message = 'HEY THERE'
  const isError = false
  const props = { foo: 1, bar: 0 }
  flashMessage(message, { isError, props })((action) => {
    if (action.type !== 'ADD_FLASH') return
    const payload = action.payload
    delete payload.id
    expect(payload).toEqual({ message, isError, props })
  })
})

test('flashErrorMessage sets error message to true', () => {
  const message = 'HEY THERE'
  const props = { foo: 1, bar: 0 }
  flashErrorMessage(message, { props })((action) => {
    if (action.type !== 'ADD_FLASH') return
    const payload = action.payload
    delete payload.id
    expect(payload).toEqual({ message, isError: true, props })
  })
})

