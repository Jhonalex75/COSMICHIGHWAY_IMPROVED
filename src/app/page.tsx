"use client";

import { useState } from 'react';
import type { Asteroid } from '@/lib/celestial-data';
import { ASTEROID_DATA, PLANET_DATA, SUN_DATA } from '@/lib/celestial-data';
import SolarSystem from '@/components/solar-system';
import Controls from '@/components/controls';
import InsightDialog from '@/components/insight-dialog';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0.2);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);

  const handleAsteroidClick = (asteroidName: string) => {
    const asteroid = ASTEROID_DATA[asteroidName as keyof typeof ASTEROID_DATA];
    if (asteroid) {
      setSelectedAsteroid(asteroid);
    }
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
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onAsteroidClick={handleAsteroidClick}
      />
      
      <Controls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
      />

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
