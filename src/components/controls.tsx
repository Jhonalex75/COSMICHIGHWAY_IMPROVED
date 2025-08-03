"use client";

import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, onTogglePlay, animationSpeed, onSpeedChange }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
      <Card className="bg-card/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
           <CardTitle className="text-sm font-medium text-center">Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Button onClick={onTogglePlay} size="icon" variant="ghost" className="text-primary-foreground hover:bg-accent">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <div className="flex-grow flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Slow</span>
            <Slider
              min={0.01}
              max={1}
              step={0.01}
              value={[animationSpeed]}
              onValueChange={(value) => onSpeedChange(value[0])}
            />
            <span className="text-xs text-muted-foreground">Fast</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Controls;
