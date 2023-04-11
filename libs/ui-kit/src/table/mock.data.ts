export const TABLE_MOCK_DATA = new Array(10)
  .fill(1)
  .map((_, index) => ({
    num: index + 1,
    name: 'Test_' + index,
    description: 'Description_' + index,
  }))