# 🚀 COSMIC HIGHWAY - IMPROVED

![Game Preview](./preview.png)

**COSMIC HIGHWAY - IMPROVED** es una versión optimizada de un juego de plataformas en 3D desarrollado en Unity, donde el jugador debe atravesar una autopista cósmica saltando sobre plataformas móviles de colores. Esta edición introduce mejoras visuales, de jugabilidad y estructura de código para una experiencia más pulida y didáctica.

## 🧠 Propósito Educativo

Este proyecto tiene fines pedagógicos, especialmente para enseñar conceptos como:

- Movimiento en 3D en Unity
- Generación dinámica de plataformas
- Lógica de detección y salto sobre plataformas del mismo color
- Bucles de juego simples con lógica de victoria y derrota
- Uso de colores como mecánica de juego

## 🎮 Mecánica del Juego

- Controla una cápsula que se desplaza sobre plataformas de colores flotantes.
- Salta solo sobre plataformas del **mismo color** que tu cápsula.
- Si aterrizas sobre un color distinto, **pierdes**.
- Cada nivel genera un patrón de plataformas aleatorio pero lógico.

## 📁 Estructura del Proyecto
COSMICHIGHWAY_IMPROVED/
├── Assets/
│ ├── Scripts/
│ │ ├── GameManager.cs
│ │ ├── ColorManager.cs
│ │ └── PlatformGenerator.cs
│ ├── Prefabs/
│ │ ├── Platform.prefab
│ │ └── Player.prefab
│ └── Scenes/
│ └── MainScene.unity
├── README.md
└── ProjectSettings/

## 🔍 Características Mejoradas

- 🌈 Plataforma lógica: Se generan **9 cubos por color** (rojo, verde, azul).
- 🧠 Asistencia lógica: Se planea incorporar una **ayuda visual o guiada** para que el jugador comprenda qué plataformas puede pisar.
- 🧩 Modularidad: Código dividido en componentes reutilizables y fáciles de mantener.
- 💥 Efectos mejorados: Sonido, partículas y transición de niveles en desarrollo.

## 🛠️ Tecnologías Usadas

- Unity 2022.3+
- Lenguaje: C#
- Sistema de físicas de Unity
- Ilustraciones con materiales básicos
- Versión mejorada del script `CubeSpawner`

## 🧩 Próximas Mejoras

- Agregar un **algoritmo que oriente al jugador** para tomar decisiones lógicas.
- Implementar puntuación por tiempo y precisión.
- Menú de selección de dificultad y color inicial.
- Guardado de récords.

## 🚀 Cómo Ejecutarlo

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Jhonalex75/COSMICHIGHWAY_IMPROVED.git

   🧠 Créditos y Autor
Creado con fines educativos por Jhon Alexander Valencia Marulanda, ingeniero mecánico, apasionado por la programación y el desarrollo de simuladores interactivos.
