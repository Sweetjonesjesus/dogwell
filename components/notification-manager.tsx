import React from 'react';
import { Toaster } from 'sonner';

export function NotificationManager() {
  return (
    <Toaster 
      position="top-right"
      richColors
      closeButton
    />
  );
} 