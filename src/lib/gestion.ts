// export function getGestionForToday(): string {
//   return String(new Date().getFullYear());
// }

// export function getPeriodoPostulacionForToday(): string {
//   const d = new Date();
//   const year = d.getFullYear();
//   const semestre = d.getMonth() <= 5 ? 1 : 2;

//   return `${semestre}-${year}`;
// }
// export function getPeriodoPostulacionForToday() {
//   return '2-2026';
// }
const TEST_YEAR = 2027;

export function getGestionForToday(): string {
  return String(TEST_YEAR);
}

export function getPeriodoPostulacionForToday(): string {
  const d = new Date();
  const semestre = d.getMonth() <= 5 ? 1 : 2;

  return `${semestre}-${TEST_YEAR}`;
}