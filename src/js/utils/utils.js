export function deepClone(input) {
  if (!input) {
    return input;
  }

  return JSON.parse(JSON.stringify(input));
}
