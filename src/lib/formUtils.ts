export const onlyNumbers = (v: string) => v.replace(/\D/g, '');

export function toISO(date: string) {
  return new Date(date).toISOString();
}
