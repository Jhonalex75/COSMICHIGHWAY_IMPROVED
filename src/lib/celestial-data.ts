export interface OrbitalElements {
  a: number; // semi-major axis (AU)
  e: number; // eccentricity
  i: number; // inclination (degrees)
  omega: number; // argument of perihelion (degrees)
  Omega: number; // longitude of ascending node (degrees)
  M0?: number; // mean anomaly at epoch (degrees)
  n?: number; // mean motion (degrees/day)
}

export interface CelestialBody {
  name: string;
  elements: OrbitalElements;
  color: number | string;
  radius: number; // in AU
}

export interface Planet extends CelestialBody {
  GM: number;
}

export interface Asteroid extends CelestialBody {
  classification: string;
  visualSpeedMultiplier?: number;
}

export const SUN_DATA: CelestialBody = {
    name: "Sun",
    elements: { a: 0, e: 0, i: 0, omega: 0, Omega: 0 },
    color: 0xffff00,
    radius: 0.05, // Visual radius, not to scale
};

export const PLANET_DATA: Record<string, Planet> = {
  earth: {
    name: 'Earth',
    elements: { a: 1.000001018, e: 0.0167086, i: -0.00001531, omega: 114.20783, Omega: -11.26064, n: 0.9856 },
    GM: 0, // Not used in this simplified model
    color: 0x3b82f6, // blue-500
    radius: 0.008,
  },
  jupiter: {
    name: 'Jupiter',
    elements: { a: 5.2026032, e: 0.04838624, i: 1.30439695, omega: 14.72847983, Omega: 100.47390909, M0: 18.81890191, n: 0.083091081 },
    GM: 0.0000284,
    color: 0xf97316, // orange-500
    radius: 0.015,
  },
  saturn: {
    name: 'Saturn',
    elements: { a: 9.5549091, e: 0.05386179, i: 2.48599187, omega: 92.59887831, Omega: 113.66242448, M0: 320.34681896, n: 0.033459652 },
    GM: 0.0000085,
    color: 0xf59e0b, // amber-500
    radius: 0.013,
  },
  uranus: {
    name: 'Uranus',
    elements: { a: 19.218446062, e: 0.04725744, i: 0.77263783, omega: 170.9542763, Omega: 74.01692503, M0: 142.2386253, n: 0.011725806 },
    GM: 0.0000014,
    color: 0x60a5fa, // blue-400
    radius: 0.01,
  },
  neptune: {
    name: 'Neptune',
    elements: { a: 30.110386869, e: 0.00859048, i: 1.77004347, omega: 44.96476227, Omega: 131.78422574, M0: 256.22834556, n: 0.005995147 },
    GM: 0.0000017,
    color: 0x3b82f6, // blue-500
    radius: 0.01,
  }
};

const classifyOrbit = (e: number): string => {
  if (e > 1.0) return "Hyperbolic";
  if (e === 1.0) return "Parabolic";
  return "Elliptical";
};

export const ASTEROID_DATA: Record<string, Asteroid> = {
  oumuamua: {
    name: "1I/'Oumuamua",
    elements: { a: -1.2797, e: 1.2005, i: 122.74, omega: 241.7, Omega: 24.6 },
    color: 0xf97316, // orange-500
    radius: 0.005,
    classification: classifyOrbit(1.2005),
    visualSpeedMultiplier: 0.3,
  },
  borisov: {
    name: "2I/Borisov",
    elements: { a: -7.268, e: 3.357, i: 44.05, omega: 209.1, Omega: 308.15 },
    color: 0xef4444, // red-500
    radius: 0.005,
    classification: classifyOrbit(3.357),
    visualSpeedMultiplier: 0.3,
  },
  atlas: {
    name: "3I/Atlas",
    elements: { a: -3.845, e: 2.156, i: 67.8, omega: 156.3, Omega: 89.7 },
    color: 0x22d3ee, // cyan-400
    radius: 0.005,
    classification: classifyOrbit(2.156),
    visualSpeedMultiplier: 0.3,
  },
};

export const ASTEROID_INFO = {
  "1I/'Oumuamua": {
    discovery: {
      year: 2017,
      by: "Telescopio Pan-STARRS1 en Hawái",
    },
    composition: "Se cree que es un objeto rocoso, posiblemente rico en metales y con una superficie enrojecida por la irradiación cósmica. No mostró la coma (atmósfera de gas y polvo) típica de los cometas.",
    hypothesis: "Su forma extremadamente alargada (diez veces más largo que ancho) es inusual. Las hipótesis van desde que es un fragmento de un planeta destruido hasta un 'iceberg de nitrógeno' desprendido de un cuerpo similar a Plutón en otro sistema estelar.",
    scientists: "Liderado por Robert Weryk, el descubrimiento generó debate. Avi Loeb, de la Universidad de Harvard, ha postulado la controvertida idea de que podría ser una sonda de origen artificial (una 'vela de luz') debido a su ligera aceleración no gravitacional.",
  },
  "2I/Borisov": {
    discovery: {
      year: 2019,
      by: "Gennadiy Borisov, un astrónomo aficionado en Crimea, usando su propio telescopio.",
    },
    composition: "A diferencia de 'Oumuamua, Borisov se parecía mucho a los cometas de nuestro sistema solar. Mostró una coma clara y se detectó la presencia de agua y monóxido de carbono, lo que sugiere que se formó en una región fría, similar al cinturón de Kuiper de nuestro sistema solar.",
    hypothesis: "Su composición tan familiar sugiere que los procesos de formación de cometas son probablemente muy similares en otros sistemas planetarios. Se considera un cometa 'prístino' que fue eyectado de su sistema estelar de origen.",
    scientists: "El descubrimiento por un aficionado fue notable. Equipos internacionales, utilizando el Telescopio Espacial Hubble y otros observatorios importantes, confirmaron su naturaleza cometaria y su trayectoria hiperbólica, solidificando su estatus como el segundo visitante interestelar conocido.",
  },
  "3I/Atlas": {
    discovery: {
      year: 2025,
      by: "Un telescopio en Sudamérica (datos basados en parámetros de simulación).",
    },
    composition: "Los análisis preliminares sugieren que es un objeto rocoso, posiblemente con algunos volátiles. Su comportamiento no ha mostrado una actividad cometaria significativa, similar a 'Oumuamua en ese aspecto, pero su trayectoria es inequívocamente interestelar.",
    hypothesis: "Al ser un descubrimiento reciente, las hipótesis aún están en desarrollo. Su existencia refuerza la idea de que los objetos interestelares son más comunes de lo que se pensaba. Estudiar su composición y rotación ayudará a determinar si representa otra clase de objeto interestelar o si comparte características con los dos anteriores.",
    scientists: "Equipos de todo el mundo están actualmente observando y analizando los datos de 3I/Atlas. La comunidad científica está enfocada en caracterizar su órbita con precisión y obtener espectros para determinar su composición química, buscando pistas sobre su sistema estelar de origen.",
  }
};
