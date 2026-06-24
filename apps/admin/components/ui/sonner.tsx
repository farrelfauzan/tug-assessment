'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster(): JSX.Element {
  return (
    <Sonner
      richColors
      closeButton
      toastOptions={{
        className: 'bg-card text-card-foreground border-border'
      }}
    />
  );
}
