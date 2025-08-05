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
    visualSpeedMultiplier: 2.0,
  },
  borisov: {
    name: "2I/Borisov",
    elements: { a: -7.268, e: 3.357, i: 44.05, omega: 209.1, Omega: 308.15 },
    color: 0xef4444, // red-500
    radius: 0.005,
    classification: classifyOrbit(3.357),
    visualSpeedMultiplier: 2.2,
  },
  atlas: {
    name: "3I/Atlas",
    elements: { a: -3.845, e: 2.156, i: 67.8, omega: 156.3, Omega: 89.7 },
    color: 0x22d3ee, // cyan-400
    radius: 0.005,
    classification: classifyOrbit(2.156),
    visualSpeedMultiplier: 2.4,
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
        "Distancia": "0.2 UA (30,000,000 km) de la Tierra",
      }
    },
    physical: {
      title: "Características Físicas",
      items: {
        "Nombre": "Hawaiano para 'visitante de lejos que llega primero'",
        "Forma": "Extremadamente alargada",
        "Velocidad Máx.": "87 km/s",
        "Clasificación": "Inicialmente cometa (C/2017 U1), luego asteroide interestelar",
      }
    },
    orbital: {
      title: "Parámetros Orbitales",
      items: {
        "Excentricidad": "1.201",
        "Inclinación": "122.7°",
        "Velocidad hiperbólica": "~26.33 km/s",
      }
    },
    composition: {
      title: "Composición y Teorías",
      items: {
        "Aceleración Anómala": "Detectada sin desgasificación visible",
        "Hipótesis Principal": "Iceberg de nitrógeno de un exoplaneta similar a Plutón",
        "Otras Teorías": "Objeto rocoso/metálico, fragmento planetario",
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
        "Distancia": "2.98 UA del Sol",
      }
    },
    physical: {
      title: "Características Físicas",
      items: {
        "Tipo": "Primer cometa interestelar inequívoco",
        "Actividad": "Cola de polvo visible y coma extendida",
        "Velocidad Máx.": "49 km/s (177,000 km/h)",
      }
    },
    orbital: {
      title: "Parámetros Orbitales",
      items: {
        "Excentricidad": "3.357",
        "Inclinación": "44.05°",
        "Velocidad hiperbólica": "~32 km/s",
      }
    },
    composition: {
      title: "Composición y Análisis",
      items: {
        "Composición Clave": "Cantidades inusualmente altas de monóxido de carbono (CO)",
        "Significado": "Sugiere formación en una región muy fría de su sistema estelar",
        "Telescopios Clave": "Hubble, ALMA, Telescopio William Herschel",
      }
    }
  },
  "3I/Atlas": {
    discovery: {
      title: "Descubrimiento",
      items: {
        "Fecha": "1 de julio de 2024",
        "Descubridor": "Sistema ATLAS (Sudáfrica)",
        "Telescopio": "Observatorio Vera C. Rubin (Chile)",
        "Designación": "C/2024 BX1 (ATLAS)",
      }
    },
    physical: {
      title: "Características Físicas",
      items: {
        "Tamaño Estimado": "~11 km (7 millas) de ancho",
        "Récord": "El objeto interestelar más grande jamás visto",
        "Velocidad": "58 km/s",
        "Actividad": "Coma difusa observada",
      }
    },
    orbital: {
      title: "Parámetros Orbitales",
      items: {
        "Excentricidad": "2.156",
        "Inclinación": "67.8°",
        "Trayectoria": "Atravesando el sistema solar interior",
      }
    },
    composition: {
      title: "Estado Actual y Significado",
      items: {
        "Investigación": "Científicos analizando datos antes de que abandone el sistema",
        "Controversia": "Especulación mediática sobre origen artificial (desestimada)",
        "Importancia": "Oportunidad única para estudiar un objeto prístino a gran escala",
      }
    }
  }
};
