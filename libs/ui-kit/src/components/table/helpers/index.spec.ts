import { descendingComparator, getComparator, stableSort, stableSortWithPaging } from '.';

describe('descendingComparator', () => {
  it('should return 1 when b[orderBy] is less than a[orderBy]', () => {
    const result = descendingComparator({ prop: 5 }, { prop: 10 }, 'prop');
    expect(result).toBe(1);
  });

  it('should return -1 when b[orderBy] is greater than a[orderBy]', () => {
    const result = descendingComparator({ prop: 10 }, { prop: 5 }, 'prop');
    expect(result).toBe(-1);
  });

  it('should return 0 when b[orderBy] is equal to a[orderBy]', () => {
    const result = descendingComparator({ prop: 5 }, { prop: 5 }, 'prop');
    expect(result).toBe(0);
  });
});

describe('getComparator', () => {
  it('should return a descending comparator when order is desc', () => {
    const order = 'desc';
    const orderBy = 'prop'; // Replace with the actual key you are using

    const comparator = getComparator(order, orderBy);

    const result = comparator({ prop: 5 }, { prop: 10 });
    expect(result).toBe(1);
  });

  it('should return an ascending comparator when order is asc', () => {
    const order = 'asc';
    const orderBy = 'prop'; // Replace with the actual key you are using

    const comparator = getComparator(order, orderBy);

    const result = comparator({ prop: 5 }, { prop: 10 });
    expect(result).toBe(-1);
  });
});

describe('stableSort and stableSortWithPaging', () => {
  const testData = [
    { id: 1, name: 'Alice' },
    { id: 1, name: 'Alice 1' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  it('should sort the array without pagination if pageSize and currentPage are not provided', () => {
    const result = stableSort(testData);

    expect(result).toEqual(testData);
  });

  it('should sort and paginate the array when pageSize and currentPage are provided', () => {
    const pageSize = 2;
    const currentPage = 1;

    const result = stableSortWithPaging(testData, pageSize, currentPage);

    // Add your assertions based on the expected sorted and paginated array
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice 1' },
    ]);
  });

  it('should use the custom comparator function if provided', () => {
    const comparator = getComparator('asc', 'id');

    const result = stableSortWithPaging(testData, undefined, undefined, comparator);

    // Add your assertions based on the expected array sorted using the custom comparator
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice 1' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]);
  });

  it('should use the custom comparator function if provided', () => {
    const comparator = getComparator('desc', 'id');

    const result = stableSortWithPaging(testData, undefined, undefined, comparator);

    // Add your assertions based on the expected array sorted using the custom comparator
    expect(result).toEqual([
      { id: 3, name: 'Charlie' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice 1' },
    ]);
  });
});
