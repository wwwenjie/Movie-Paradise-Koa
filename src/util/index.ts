export function notNull (object: Object): boolean {
  return !(object === null || object === undefined)
}

export function time () {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    const func = descriptor.value
    descriptor.value = function (...args) {
      console.time(`${name} running time`)
      const results = func.apply(this, args)
      console.timeEnd(`${name} running time`)
      return results
    }
  }
}

export function getRandomItemFromArray (array: any[], amount: number = array.length): any[] {
  const result = []
  let counter = 0
  for (let i = 0; i < array.length; i++) {
    if (counter === amount) {
      break
    }
    const index = Math.floor(Math.random() * (array.length - i))
    result.push(array[index])
    array[index] = array[array.length - i - 1]
    counter++
  }
  return result
}
