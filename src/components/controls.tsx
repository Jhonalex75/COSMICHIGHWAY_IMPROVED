"use client";

import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asteroid } from '@/lib/celestial-data';
import { Separator } from '@/components/ui/separator';

interface ControlsProps {
  playingState: Record<string, boolean>;
  onTogglePlay: (asteroidName: string) => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  asteroids: Asteroid[];
}

const Controls: React.FC<ControlsProps> = ({ playingState, onTogglePlay, animationSpeed, onSpeedChange, asteroids }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
      <Card className="bg-card/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
           <CardTitle className="text-sm font-medium text-center">Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Speed:</span>
            <Slider
              min={0.001}
              max={0.1}
              step={0.001}
              value={[animationSpeed]}
              onValueChange={(value) => onSpeedChange(value[0])}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-2 text-center">
            {asteroids.map((asteroid) => (
              <div key={asteroid.name} className="flex flex-col items-center gap-1">
                 <span className="text-xs font-medium truncate w-full" title={asteroid.name}>
                  {asteroid.name}
                </span>
                <Button 
                  onClick={() => onTogglePlay(asteroid.name)} 
                  size="icon" 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-accent h-8 w-8"
                >
                  {playingState[asteroid.name] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Controls;
