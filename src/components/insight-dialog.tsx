"use client";

import { Asteroid, ASTEROID_INFO } from '@/lib/celestial-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from './ui/separator';

interface InsightDialogProps {
  asteroid: Asteroid | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InfoSectionProps {
  title: string;
  items: Record<string, string>;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, items }) => (
  <div>
    <h3 className="text-lg font-semibold text-primary-foreground mb-3">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
      {Object.entries(items).map(([key, value]) => (
        <div key={key}>
          <p className="font-semibold text-foreground/80">{key}:</p>
          <p className="text-foreground/90">{value}</p>
        </div>
      ))}
    </div>
  </div>
);

const InsightDialog: React.FC<InsightDialogProps> = ({ asteroid, open, onOpenChange }) => {
  if (!asteroid) return null;

  const info = ASTEROID_INFO[asteroid.name as keyof typeof ASTEROID_INFO];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-primary">{asteroid.name}</DialogTitle>
           <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">Clasificación: {asteroid.classification}</Badge>
            <Badge variant="secondary">a: {asteroid.elements.a.toFixed(3)} AU</Badge>
            <Badge variant="secondary">e: {asteroid.elements.e.toFixed(3)}</Badge>
            <Badge variant="secondary">i: {asteroid.elements.i.toFixed(2)}°</Badge>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4 -mr-4">
            {info && (
              <div className="space-y-4 pt-4">
                <InfoSection title={info.discovery.title} items={info.discovery.items} />
                <Separator className="my-4" />
                <InfoSection title={info.physical.title} items={info.physical.items} />
                <Separator className="my-4" />
                <InfoSection title={info.orbital.title} items={info.orbital.items} />
                <Separator className="my-4" />
                <InfoSection title={info.composition.title} items={info.composition.items} />
              </div>
            )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InsightDialog;
