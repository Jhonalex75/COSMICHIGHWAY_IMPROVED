"use client";

import { useEffect, useState } from 'react';
import { Asteroid } from '@/lib/celestial-data';
import { asteroidInsights } from '@/ai/flows/asteroid-insights';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface InsightDialogProps {
  asteroid: Asteroid | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// This is a mock implementation. In a real scenario, you'd get this from the 3D simulation state.
const getMockMetrics = () => ({
    distanceToSun: Math.random() * 5,
    velocity: Math.random() * 20,
    acceleration: Math.random() * 5,
});

const InsightDialog: React.FC<InsightDialogProps> = ({ asteroid, open, onOpenChange }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (asteroid && open) {
      setLoading(true);
      setInsight(null);
      setError(null);
      
      const fetchInsight = async () => {
        try {
          // In a real application, you would pass the actual current metrics from the simulation state.
          // For this example, we'll use mocked values.
          const currentMetrics = getMockMetrics();

          const result = await asteroidInsights({
            name: asteroid.name,
            semiMajorAxis: asteroid.elements.a,
            eccentricity: asteroid.elements.e,
            inclination: asteroid.elements.i,
            distanceToSun: currentMetrics.distanceToSun,
            velocity: currentMetrics.velocity,
            acceleration: currentMetrics.acceleration,
          });
          setInsight(result.insights);
        } catch (e) {
          setError('Failed to generate insights. Please try again later.');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      
      fetchInsight();
    }
  }, [asteroid, open]);

  if (!asteroid) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary">{asteroid.name}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">Type: {asteroid.classification}</Badge>
            <Badge variant="secondary">a: {asteroid.elements.a.toFixed(3)} AU</Badge>
            <Badge variant="secondary">e: {asteroid.elements.e.toFixed(3)}</Badge>
            <Badge variant="secondary">i: {asteroid.elements.i.toFixed(2)}°</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 prose prose-invert prose-sm text-foreground/90">
          <h3 className="text-lg font-semibold text-primary-foreground">Educational Insights</h3>
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {insight && <p>{insight}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsightDialog;

    