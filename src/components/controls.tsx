"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asteroid } from '@/lib/celestial-data';
import { Telescope } from 'lucide-react';

interface ControlsProps {
  asteroids: Asteroid[];
  onAsteroidSelect: (name: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ asteroids, onAsteroidSelect }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
      <Card className="bg-card/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2 pt-4">
           <CardTitle className="text-sm font-medium text-center">Interstellar Visitors</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row justify-center gap-2 p-4">
          {asteroids.map((asteroid) => (
            <Button 
              key={asteroid.name}
              onClick={() => onAsteroidSelect(asteroid.name)} 
              variant="outline"
              className="bg-card/80 backdrop-blur-sm border-white/20 text-white hover:bg-accent hover:text-accent-foreground flex-1"
            >
              <Telescope className="mr-2 h-4 w-4" />
              <span className="truncate">{asteroid.name}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Controls;
