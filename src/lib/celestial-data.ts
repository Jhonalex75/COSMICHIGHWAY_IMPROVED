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
    visualSpeedMultiplier: 0.8,
  },
  borisov: {
    name: "2I/Borisov",
    elements: { a: -7.268, e: 3.357, i: 44.05, omega: 209.1, Omega: 308.15 },
    color: 0xef4444, // red-500
    radius: 0.005,
    classification: classifyOrbit(3.357),
    visualSpeedMultiplier: 1.0,
  },
  atlas: {
    name: "3I/Atlas",
    elements: { a: -3.845, e: 2.156, i: 67.8, omega: 156.3, Omega: 89.7 },
    color: 0x22d3ee, // cyan-400
    radius: 0.005,
    classification: classifyOrbit(2.156),
    visualSpeedMultiplier: 1.2,
  },
};

export const ASTEROID_INFO = {
  "1I/'Oumuamua": {
    discovery: {
      title: "Descubrimiento",
      items: {
        "Fecha": "19 de octubre de 2017",
        "Descubridor": "Robert Weryk",
        "Telescopio": "Pan-STARRS 1 (Haleakala, Hawaii)",
        "Distancia Inicial": "0.2 UA de la Tierra",
      }
    },
    physical: {
      title: "Características Físicas",
      items: {
        "Nombre": "Hawaiano: 'Visitante de lejos que llega primero'",
        "Forma": "Extremadamente alargada, sin precedentes",
        "Velocidad Máxima": "~87 km/s (cerca del perihelio)",
        "Clasificación": "Inicialmente cometa, reclasificado como objeto interestelar",
      }
    },
    orbital: {
      title: "Parámetros Orbitales",
      items: {
        "Excentricidad": "1.20 (Hiperbólica)",
        "Inclinación": "123° (respecto a la eclíptica)",
        "Velocidad Hiperbólica": "~26.3 km/s",
        "Aceleración Anómala": "Leve aceleración no gravitacional detectada",
      }
    },
    composition: {
      title: "Composición y Teorías",
      items: {
        "Composición visible": "Rocosa/metálica, sin coma de gas o polvo",
        "Hipótesis principal": "Iceberg de nitrógeno desprendido de un exoplaneta",
        "Otras teorías": "Fragmento planetario, objeto rico en hidrógeno, tecnología alienígena (Avi Loeb)",
      }
    }
  },
  "2I/Borisov": {
    discovery: {
      title: "Descubrimiento",
      items: {
        "Fecha": "30 de agosto de 2019",
        "Descubridor": "Gennady Borisov",
        "Observatorio": "MARGO (Crimea)",
        "Distancia inicial": "~3 UA del Sol",
      }
    },
    physical: {
      title: "Características Físicas",
      items: {
        "Tipo": "Primer cometa interestelar inequívoco",
        "Actividad": "Cola de polvo visible y coma extendida",
        "Velocidad Máxima": "~49 km/s (177,000 km/h) en el perihelio",
      }
    },
    orbital: {
      title: "Parámetros Orbitales",
      items: {
        "Excentricidad": "~3.36 (Extremadamente hiperbólica)",
        "Inclinación": "44° (respecto a la eclíptica)",
        "Velocidad Hiperbólica": "~32 km/s",
      }
    },
    composition: {
      title: "Composición y Análisis",
      items: {
        "Composición Clave": "Cantidades inusualmente altas de monóxido de carbono (CO)",
        "Significado": "Sugiere formación en una región muy fría de su sistema estelar",
        "Similitud": "Más parecido a los cometas de nuestro Sistema Solar que 'Oumuamua",
        "Telescopios Clave": "Hubble, ALMA, VLT, Keck",
      }
    }
  },
  "3I/Atlas": {
    discovery: {
      title: "Descubrimiento",
      items: {
        "Fecha": "1 de julio de 2025",
        "Descubridor": "Sistema ATLAS (Sudáfrica)",
        "Designación Oficial": "A/2025 N1 (ATLAS)",
        "Confirmación": "Observatorio Vera C. Rubin (Chile)",
      }
    },
    physical: {
      title: "Características Físicas",
      items: {
        "Tamaño Estimado": "~11 km (7 millas) de ancho",
        "Récord": "El objeto interestelar más grande jamás detectado",
        "Velocidad": "~58 km/s",
        "Actividad": "Coma difusa y una posible cola peculiar observadas",
      }
    },
    orbital: {
      title: "Parámetros Orbitales",
      items: {
        "Excentricidad": "2.156 (Hiperbólica)",
        "Inclinación": "67.8° (respecto a la eclíptica)",
        "Trayectoria": "Atraviesa el sistema solar interior rápidamente",
      }
    },
    composition: {
      title: "Estado Actual y Significado",
      items: {
        "Investigación": "Científicos analizan datos espectrales para determinar su composición",
        "Importancia": "Oportunidad única para estudiar un objeto prístino a gran escala de otro sistema",
        "Hipótesis": "Podría ser un planetesimal helado o un fragmento de un núcleo cometario masivo",
      }
    }
  }
};
