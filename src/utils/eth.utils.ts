import { BigNumber, ethers } from 'ethers'

/**
 * Rounds wei value to ether with maxDecimals
 * @param weiValue Wei value to round
 * @param maxDecimals Max decimals to round to
 */
export function roundWeiToEther(weiValue: BigNumber, maxDecimals: number = 5): string {
  const divider = ethers.BigNumber.from('10').pow(18 - maxDecimals);
  const roundUpValue = ethers.BigNumber.from('10').pow(18 - maxDecimals - 1);
  const smallestUnit = ethers.BigNumber.from('10').pow(18 - maxDecimals);

  let roundedValue = weiValue.div(divider).mul(divider);

  if (weiValue.isZero()) {
    return '0';
  }

  if(weiValue.mod(divider).gte(roundUpValue)){
    roundedValue = roundedValue.add(divider);
  }

  if (roundedValue.isZero()) {
    roundedValue = smallestUnit;
  }

  return ethers.utils.formatUnits(roundedValue, 18);
}
