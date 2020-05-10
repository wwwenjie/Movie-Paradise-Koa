function testFunction (value: string): string {
  return value
}

test('test demo', () => {
  expect(testFunction('test')).toBe('test')
})
