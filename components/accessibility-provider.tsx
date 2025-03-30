import React, { createContext, useContext, useState } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  contrast: 'normal' | 'high';
  setFontSize: (size: number) => void;
  setContrast: (contrast: 'normal' | 'high') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState<'normal' | 'high'>('normal');

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      contrast,
      setFontSize,
      setContrast,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}; 