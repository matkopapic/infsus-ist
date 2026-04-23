export function currentDateString() {
  return new Date().toISOString().slice(0, 10);
}
