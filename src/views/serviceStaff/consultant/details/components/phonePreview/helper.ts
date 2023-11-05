export function formatNumber(number: number) {
  if (typeof number !== 'number') {
    return number;
  }

  if (number >= 10000) {
    let quotient = number / 10000;
    if (!Number.isInteger(quotient)) {
      quotient = +quotient.toFixed(1);
    }
    return quotient + '万';
  } else {
    return number.toString();
  }
}
