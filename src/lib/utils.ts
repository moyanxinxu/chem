import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const isCasValid = (cas: string) => {

  const casArray = cas.split("-");

  if (casArray.length !== 3) return false;

  const [a, b, c] = casArray;

  const aValid = a.length >= 2 && a.length <= 7 && Number.isInteger(Number(a));
  const bValid = b.length === 2 && Number.isInteger(Number(b));
  const cValid = c.length === 1 && Number.isInteger(Number(c));
  const isValid = aValid && bValid && cValid;

  const sum = [...a, ...b].reverse().reduce((acc, digit, index) => {
    return acc + parseInt(digit) * (index + 1);
  }, 0);

  return sum % 10 === parseInt(c);
}

export { isCasValid };