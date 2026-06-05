export interface DatosEstudiante {
  ID_estudiante?: number;
  promedio?: number;
  numero_Materias_Reprobadas?: number;
  año_ingreso?: number;
  semestre?: boolean;
  ru?: number | null;
}

export interface PersonaBase {
  ci: string;
  expedido: string;

  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  apellido_casado?: string;

  correo_electronico: string;
  celular: string;
}

export interface PersonaListItem extends PersonaBase {
  ID_persona: number;
  ru?: number | null;
  estudiante?: DatosEstudiante | DatosEstudiante[] | null;

  usuario?: {
    ID_usuario: number;
    username: string;
  };
}

export interface PersonaFull extends PersonaBase {
  genero: 'M' | 'F';
  direccion: string;
  fecha_nacimiento: string;
  estado_civil: string;

  // Datos que vienen desde backend al editar
  estudiante?: DatosEstudiante | DatosEstudiante[] | null;

  // Datos académicos usados directamente en el formulario
  ru?: number | null;
  promedio?: number;
  numero_Materias_Reprobadas?: number;
  año_ingreso?: number;
  semestre?: boolean;
}