"use client";

import { Asteroid, ASTEROID_INFO } from '@/lib/celestial-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InsightDialogProps {
  asteroid: Asteroid | null;
  metrics: { distanceToSun: number; velocity: number; acceleration: number; } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InsightDialog: React.FC<InsightDialogProps> = ({ asteroid, open, onOpenChange }) => {
  if (!asteroid) return null;

  const info = ASTEROID_INFO[asteroid.name as keyof typeof ASTEROID_INFO];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-primary">{asteroid.name}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">Type: {asteroid.classification}</Badge>
            <Badge variant="secondary">a: {asteroid.elements.a.toFixed(3)} AU</Badge>
            <Badge variant="secondary">e: {asteroid.elements.e.toFixed(3)}</Badge>
            <Badge variant="secondary">i: {asteroid.elements.i.toFixed(2)}°</Badge>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="mt-4 prose prose-invert prose-sm text-foreground/90">
            {info && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-foreground mb-2">Descubrimiento</h3>
                  <p><strong>Año:</strong> {info.discovery.year}</p>
                  <p><strong>Detectado por:</strong> {info.discovery.by}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-foreground mb-2">Composición y Características</h3>
                  <p>{info.composition}</p>
                </div>
                 <div>
                  <h3 className="text-lg font-semibold text-primary-foreground mb-2">Hipótesis de Origen</h3>
                  <p>{info.hypothesis}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-foreground mb-2">Científicos y Posturas</h3>
                  <p>{info.scientists}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InsightDialog;
