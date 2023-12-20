import { utils } from 'ethers'
import { roundWeiToEther } from '../src/utils/eth.utils'

describe("Utils", () => {
  test("roundWeiToEther", async () => {
    const roundTest = (input: string, expected: string) => {
      expect(roundWeiToEther(utils.parseEther(input))).toEqual(expected);
    }

    roundTest('0.000000012443523451', '0.00001');
    roundTest('0.0001244352345', '0.00013');
    roundTest('0.0001', '0.0001');
    roundTest('505', '505.0');
    roundTest('1', '1.0');
    roundTest('1.01', '1.01');
    roundTest('1.001', '1.001');
    roundTest('1.0001', '1.0001');
    roundTest('1.00001', '1.00001');
    roundTest('1.000011', '1.00002');
    roundTest('2342352352352352341.000011', '2342352352352352341.00002');
  });
});
