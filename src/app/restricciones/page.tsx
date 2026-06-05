'use client';

export default function RestriccionesPage() {
  const restricciones = [
    'No haber vencido el primer año o segundo semestre en la carrera.',
    'No haber concluido el plan de estudios (egresados, según convocatoria).',
    'No estar cursando una segunda carrera paralela en la UPEA.',
    'No ser funcionario público.',
    'En caso de hermanos, solo UNO podrá postularse en la misma carrera.',
    'En caso de cónyuges o convivientes, solo UNO podrá postularse en la misma carrera.',
    'No estar estudiando en otras universidades públicas o privadas, ni institutos técnicos.',
    'No haber sido beneficiario de becas IDH en más de dos oportunidades.',
    'No estar recibiendo beneficios simultáneos (auxiliaturas, internado, etc.).',
    'No estar sujeto a restricciones por resolución de carrera (HCC).',
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Restricciones para Postulación a Becas
      </h1>

      <p className="mb-6 text-gray-600">
        Antes de iniciar su postulación, verifique que cumple con los siguientes requisitos.
        El incumplimiento de cualquiera de estas condiciones puede inhabilitar su postulación.
      </p>

      <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
        <ul className="space-y-3">
          {restricciones.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-700"
            >
              <span className="text-red-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-sm text-yellow-700">
          ⚠️ Nota: Estas restricciones son generales. Algunas convocatorias pueden incluir
          condiciones adicionales específicas.
        </p>
      </div>
    </div>
  );
}