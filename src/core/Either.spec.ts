import { Either, left, right } from './Either'

function doSomething(x: boolean): Either<string, number> {
  if (x) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const success = doSomething(true)

  if (success.isRight()) {
    console.log(success.value)
  }

  expect(success.isRight()).toEqual(true)
  expect(success.isLeft()).toEqual(false)
})

test('Error result', () => {
  const error = doSomething(false)

  expect(error.isLeft()).toEqual(true)
  expect(error.isRight()).toEqual(false)
})
