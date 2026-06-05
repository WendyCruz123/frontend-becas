// src/panos/scenes.ts

export const scenes = {
  entrada: {
    slug: 'entrada',
    title: 'Entrada principal',
    imageUrl: '/panos/entrada.jpg',
    width: 8000,
    defaultView: { yaw: -0.3839, pitch: 0.0236, fov: Math.PI / 3 },
  },

  entradaFisica: {
    slug: 'entradaFisica',
    title: 'Entrada Carrera de Física',
    imageUrl: '/panos/entradafisica.jpg',
    width: 8000,
    defaultView: { yaw: -0.3839, pitch: 0.0236, fov: Math.PI / 3 },
  },

  piso5: {
    slug: 'piso5',
    title: 'Piso 5',
    imageUrl: '/panos/piso5.jpg',
    width: 8000,
    defaultView: { yaw: 0, pitch: 0, fov: Math.PI / 3 },
  },

  direccion: {
    slug: 'direccion',
    title: 'Dirección de Carrera y Kardex',
    imageUrl: '/panos/direccion.jpg',
    width: 8000,
    defaultView: { yaw: 0, pitch: 0, fov: Math.PI / 3 },
  },
  centro: {
  slug: 'centro',
  title: 'Centro de Estudiantes',
  imageUrl: '/panos/centro.jpg',
  width: 8000,
  defaultView: { yaw: 0, pitch: 0, fov: Math.PI / 3 },
  },
  emblematico: {
    slug: 'emblematico',
    title: 'Edificio Emblemático',
    imageUrl: '/panos/emblematico.jpg',
    width: 8000,
    defaultView: { yaw: 0, pitch: 0, fov: Math.PI / 3 },
  },

  entradaDisbec: {
    slug: 'entradaDisbec',
    title: 'Entrada DISBECT',
    imageUrl: '/panos/entradaDisbec.jpg',
    width: 8000,
    defaultView: { yaw: 0, pitch: 0, fov: Math.PI / 3 },
  },

  disbect: {
    slug: 'disbect',
    title: 'DISBECT',
    imageUrl: '/panos/DISBECT.jpg',
    width: 8000,
    defaultView: { yaw: 0, pitch: 0, fov: Math.PI / 3 },
  },
  dicyt: {
  slug: 'dicyt',
  title: 'DICYT',
  imageUrl: '/panos/DICYT.jpg',
  width: 8000,
  defaultView: { yaw: 0, pitch: 0, fov: Math.PI / 3 },
  },
} as const

export type SceneKey = keyof typeof scenes

export const routes = {
  direccion_carrera_kardex: {
    slug: 'direccion_carrera_kardex',
    title: 'Ruta: Dirección de Carrera y Kardex',
    start: 'entrada' as SceneKey,

    links: [
      {
        from: 'entrada' as SceneKey,
        to: 'entradaFisica' as SceneKey,
        yaw: -Math.PI / 3,
        pitch: 0.05,
        label: 'Ir a Carrera de Física',
      },
      {
        from: 'entradaFisica' as SceneKey,
        to: 'piso5' as SceneKey,
        yaw: -0.7,
        pitch: 0.05,
        label: 'Ir a Piso 5',
      },
      {
        from: 'piso5' as SceneKey,
        to: 'direccion' as SceneKey,
        yaw: 0.8,
        pitch: 0.04,
        label: 'Ir a Dirección',
      },
    ],

    infos: [
      {
        at: 'direccion' as SceneKey,
        yaw: 0.2,
        pitch: 0.08,
        title: 'Kardex y Dirección de Carrera',
        text: 'Lugar de atención administrativa de la Carrera de Física. Horario de atención: 08:00 a 12:30 y 14:00 a 18:00.',
      },
    ],
  },
  centro_estudiantes_fisica: {
  slug: 'centro_estudiantes_fisica',
  title: 'Ruta: Centro de Estudiantes de Física',
  start: 'entrada' as SceneKey,

  links: [
    {
      from: 'entrada' as SceneKey,
      to: 'entradaFisica' as SceneKey,
      yaw: -Math.PI / 3,
      pitch: 0.05,
      label: 'Ir a Carrera de Física',
    },
    {
      from: 'entradaFisica' as SceneKey,
      to: 'piso5' as SceneKey,
      yaw: -0.7,
      pitch: 0.05,
      label: 'Ir a Piso 5',
    },
    {
      from: 'piso5' as SceneKey,
      to: 'centro' as SceneKey,
      yaw: -1.0526,
      pitch: 0.0518,
      label: 'Ir a Centro de Estudiantes',
    },
  ],

  infos: [
    {
      at: 'centro' as SceneKey,
      yaw: 0.2,
      pitch: 0.08,
      title: 'Centro de Estudiantes',
      text: 'Lugar de atención y representación estudiantil de la Carrera de Física. Horario de atención: 08:00 a 12:30 y 14:00 a 18:00.',
    },
  ],
},
ruta_disbect: {
  slug: 'ruta_disbect',
  title: 'Ruta: DISBECT',
  start: 'emblematico' as SceneKey,

  links: [
    {
      from: 'emblematico' as SceneKey,
      to: 'entradaDisbec' as SceneKey,
      yaw: 0,
      pitch: 0.05,
      label: 'Ir a Entrada DISBECT',
    },
    {
      from: 'entradaDisbec' as SceneKey,
      to: 'disbect' as SceneKey,
      yaw: 0,
      pitch: 0.05,
      label: 'Ir a DISBECT',
    },
  ],

  infos: [
    {
      at: 'disbect' as SceneKey,
      yaw: 0.2,
      pitch: 0.08,
      title: 'DISBECT',
      text: 'Oficina de atención DISBECT. Horario de atención: 08:30 a 12:30 y 14:00 a 18:00. Encargado: Cristian Pedro.',
    },
  ],
},
ruta_dicyt: {
  slug: 'ruta_dicyt',
  title: 'Ruta: DICYT',
  start: 'emblematico' as SceneKey,

  links: [
    {
      from: 'emblematico' as SceneKey,
      to: 'dicyt' as SceneKey,
      yaw: 0,
      pitch: 0.05,
      label: 'Ir a DICYT',
    },
  ],

  infos: [
    {
      at: 'dicyt' as SceneKey,
      yaw: 0.2,
      pitch: 0.08,
      title: 'DICYT',
      text: 'Dirección de Investigación Científica y Tecnológica (DICYT). Atención en piso 2, ventanilla de Trabajos de Investigación. Horario: 08:30 a 12:30 y 14:00 a 18:00.',
    },
  ],
},
} as const

export type RouteKey = keyof typeof routes