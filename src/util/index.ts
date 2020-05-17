export function notNull (object: Object): boolean {
  return !(object === null || object === undefined)
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
