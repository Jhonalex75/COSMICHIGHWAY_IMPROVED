"use client";

import { useState } from 'react';
import type { Asteroid } from '@/lib/celestial-data';
import { ASTEROID_DATA, PLANET_DATA, SUN_DATA } from '@/lib/celestial-data';
import SolarSystem from '@/components/solar-system';
import Controls from '@/components/controls';
import InsightDialog from '@/components/insight-dialog';
import InfoPanel from '@/components/info-panel';

export default function Home() {
  const [animationSpeed, setAnimationSpeed] = useState(0.001);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [asteroidMetrics, setAsteroidMetrics] = useState<Record<string, { distanceToSun: number; velocity: number; acceleration: number }>>({});
  const [playingState, setPlayingState] = useState<Record<string, boolean>>({
    "1I/'Oumuamua": true,
    "2I/Borisov": true,
    "3I/Atlas": true,
  });

  const handleAsteroidClick = (asteroidName: string) => {
    const asteroid = Object.values(ASTEROID_DATA).find(a => a.name === asteroidName);
    if (asteroid) {
      setSelectedAsteroid(asteroid);
    }
  };
  
  const handleMetricsUpdate = (name: string, metrics: { distanceToSun: number; velocity: number; acceleration: number }) => {
    setAsteroidMetrics(prev => ({ ...prev, [name]: metrics }));
  };
  
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background font-body">
      <div className="absolute top-4 left-4 z-20 text-foreground md:top-8 md:left-8">
        <h1 className="text-3xl font-bold font-headline text-white drop-shadow-lg md:text-5xl">Cosmic Highway</h1>
        <p className="text-sm text-gray-300 drop-shadow-md md:text-base">An interactive journey with interstellar visitors.</p>
      </div>
      
      <SolarSystem
        sun={SUN_DATA}
        planets={Object.values(PLANET_DATA)}
        asteroids={Object.values(ASTEROID_DATA)}
        playingState={playingState}
        animationSpeed={animationSpeed}
        onAsteroidClick={handleAsteroidClick}
        onMetricsUpdate={handleMetricsUpdate}
      />
      
      <Controls
        asteroids={Object.values(ASTEROID_DATA)}
        onAsteroidSelect={handleAsteroidClick}
      />

      <InfoPanel />

      <InsightDialog
        asteroid={selectedAsteroid}
        open={!!selectedAsteroid}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedAsteroid(null);
          }
        }}
      />
    </main>
  );
}
