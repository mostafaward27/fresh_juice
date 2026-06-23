import React, { createContext, useContext, useState, useEffect } from 'react';

interface AntiGravityContextType {
  isAntiGravityActive: boolean;
  toggleAntiGravity: () => void;
}

const AntiGravityContext = createContext<AntiGravityContextType | undefined>(undefined);

export const AntiGravityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAntiGravityActive, setIsAntiGravityActive] = useState<boolean>(() => {
    const stored = localStorage.getItem('shabar_antigravity_active');
    return stored === 'true';
  });

  const toggleAntiGravity = () => {
    setIsAntiGravityActive(prev => {
      const next = !prev;
      localStorage.setItem('shabar_antigravity_active', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (isAntiGravityActive) {
      document.body.classList.add('antigravity-mode');
    } else {
      document.body.classList.remove('antigravity-mode');
    }
  }, [isAntiGravityActive]);

  return (
    <AntiGravityContext.Provider value={{ isAntiGravityActive, toggleAntiGravity }}>
      {children}
    </AntiGravityContext.Provider>
  );
};

export const useAntiGravity = () => {
  const context = useContext(AntiGravityContext);
  if (context === undefined) {
    throw new Error('useAntiGravity must be used within an AntiGravityProvider');
  }
  return context;
};
