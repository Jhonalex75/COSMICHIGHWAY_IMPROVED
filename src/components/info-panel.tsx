"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Info } from 'lucide-react';

const INFO_TOPICS = [
  {
    title: 'Definiciones de Términos Astronómicos',
    content: `
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Semi-eje Mayor (a):</strong> Representa la mitad del diámetro más largo de una órbita elíptica. Determina el tamaño de la órbita y el período orbital. Se mide en Unidades Astronómicas (AU), donde 1 AU es la distancia promedio de la Tierra al Sol.</li>
        <li><strong>Excentricidad (e):</strong> Mide cuán alargada es una órbita. Un valor de 0 es una órbita circular perfecta. Entre 0 y 1, la órbita es una elipse. Un valor de 1 es una órbita parabólica (escape), y mayor que 1 es una órbita hiperbólica (escape con exceso de velocidad).</li>
        <li><strong>Inclinación (i):</strong> Es el ángulo entre el plano orbital de un objeto y un plano de referencia (generalmente, el plano de la órbita de la Tierra). Una inclinación alta significa que la órbita del asteroide está muy inclinada con respecto a los planetas.</li>
        <li><strong>Órbita Hiperbólica:</strong> Una trayectoria de escape no ligada al Sol. Los objetos en órbitas hiperbólicas, como 'Oumuamua y Borisov, tienen suficiente velocidad para escapar de la gravedad del Sol y no regresarán. Son visitantes interestelares.</li>
      </ul>
    `
  },
  {
    title: 'Ecuaciones y Parámetros Utilizados',
    content: `
      <p>La simulación utiliza un modelo simplificado basado en las leyes de Kepler del movimiento planetario para trazar las trayectorias. La posición de un objeto en una órbita se puede describir mediante la siguiente ecuación en coordenadas polares:</p>
      <p class="font-mono text-center p-4 bg-muted rounded-md my-2">r = a * (1 - e²) / (1 + e * cos(θ))</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>r:</strong> Es la distancia del objeto al Sol.</li>
        <li><strong>a:</strong> Es el semi-eje mayor.</li>
        <li><strong>e:</strong> Es la excentricidad.</li>
        <li><strong>θ (theta):</strong> Es el ángulo de la posición actual del objeto con respecto a su punto más cercano al Sol (perihelio), conocido como la "anomalía verdadera".</li>
      </ul>
      <p>Para órbitas hiperbólicas (e > 1), el semi-eje mayor 'a' es negativo. La simulación transforma estas coordenadas 2D a un espacio 3D usando los ángulos de inclinación (i), longitud del nodo ascendente (Ω) y argumento del perihelio (ω).</p>
    `
  },
  {
    title: 'Velocidades de Asteroides Interestelares',
    content: `
      <p>Los asteroides interestelares entran y salen del sistema solar a velocidades extremadamente altas. Estas velocidades se conocen como "velocidad hiperbólica excedente" (v∞), que es la velocidad que el objeto retiene incluso después de escapar de la atracción gravitacional del Sol.</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>1I/'Oumuamua:</strong> Entró al sistema solar a una velocidad de aproximadamente <strong>26.33 km/s</strong> (unas 58,900 mph) con respecto al Sol.</li>
        <li><strong>2I/Borisov:</strong> Tenía una velocidad aún mayor, de unos <strong>33.8 km/s</strong> (unas 75,600 mph).</li>
      </ul>
      <p>Estas altas velocidades son una prueba clave de su origen interestelar, ya que son demasiado rápidas para que los objetos hayan estado orbitando nuestro Sol.</p>
    `
  },
  {
    title: 'Método de Resolución',
    content: `
      <p>Esta simulación visualiza las órbitas en lugar de resolverlas dinámicamente en tiempo real, lo cual requeriría una integración numérica compleja.</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li><strong>Cálculo de la Trayectoria:</strong> Para cada asteroide y planeta, se precalcula una serie de puntos a lo largo de su órbita utilizando la ecuación orbital de Kepler. Para las órbitas hiperbólicas, se tiene cuidado de trazar solo la trayectoria físicamente relevante.</li>
        <li><strong>Creación de la Curva:</strong> Los puntos calculados se utilizan para crear una curva suave (específicamente, una Catmull-Rom curve) en el motor 3D (Three.js).</li>
        <li><strong>Animación:</strong> El objeto (asteroide o planeta) se mueve a lo largo de esta curva precalculada. La velocidad de la animación se puede controlar, pero representa el paso del tiempo a lo largo de la trayectoria, no una simulación física de la velocidad variable real.</li>
        <li><strong>Cálculo de Métricas:</strong> La velocidad y la aceleración se estiman en cada fotograma comparando la posición actual con la posición anterior, lo cual es una aproximación numérica del cálculo diferencial.</li>
      </ol>
    `
  },
  {
    title: 'Conclusiones Científicas',
    content: `
      <p>El descubrimiento de objetos como 'Oumuamua y Borisov ha abierto una nueva ventana al estudio de sistemas planetarios más allá del nuestro.</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Composición Diversa:</strong> Borisov se parecía a los cometas de nuestro propio sistema solar, sugiriendo que los procesos de formación de cometas podrían ser similares en otras estrellas. 'Oumuamua, por otro lado, era único, muy alargado y sin la coma de gas y polvo típica de un cometa, lo que generó muchas teorías sobre su origen, incluyendo la de un fragmento de un planeta rico en nitrógeno similar a Plutón.</li>
        <li><strong>Frecuencia de Visitantes:</strong> La detección de estos dos objetos en un corto período de tiempo sugiere que los visitantes interestelares podrían ser mucho más comunes de lo que se pensaba. Proyectos futuros como el Observatorio Vera C. Rubin están preparados para descubrir muchos más.</li>
        <li><strong>Implicaciones para la Panspermia:</strong> La idea de que la vida puede viajar entre sistemas estelares (panspermia) se vuelve un poco más plausible con la confirmación de que el material de otros sistemas estelares viaja regularmente a través del nuestro.</li>
      </ul>
    `
  }
];

const InfoPanel: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-20 md:top-8 md:right-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-white/20 text-white hover:bg-accent hover:text-accent-foreground">
            <Info className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full md:w-[450px] bg-card/90 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle className="text-2xl font-headline text-primary">Información Adicional</SheetTitle>
            <SheetDescription>
              Aprende más sobre los conceptos y datos detrás de la simulación.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 h-full overflow-y-auto pr-6">
            <Accordion type="single" collapsible className="w-full">
              {INFO_TOPICS.map((topic, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{topic.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: topic.content }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default InfoPanel;
