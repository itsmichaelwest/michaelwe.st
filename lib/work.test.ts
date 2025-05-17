import { getSortedWorkData } from './work';
import fs from 'fs';

jest.mock('fs');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('getSortedWorkData', () => {
  it('returns posts sorted by date descending', () => {
    mockedFs.readdirSync.mockReturnValue(['first.md', 'second.md', 'third.md']);

    mockedFs.readFileSync.mockImplementation((filePath: any) => {
      if (filePath.toString().includes('first.md')) {
        return '---\ndate: "2021-01-01"\n---\nContent first';
      }
      if (filePath.toString().includes('second.md')) {
        return '---\ndate: "2023-02-01"\n---\nContent second';
      }
      return '---\ndate: "2022-06-01"\n---\nContent third';
    });

    const result = getSortedWorkData();
    const dates = result.map((r) => r.date);
    expect(dates).toEqual(['2023-02-01', '2022-06-01', '2021-01-01']);
    expect(result[0].id).toBe('second');
  });
});
