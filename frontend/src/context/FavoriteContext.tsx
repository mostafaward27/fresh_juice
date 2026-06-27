import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface FavoriteContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'shabar_favorites';

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites storage', e);
      }
    }
  }, []);

  const toggleFavorite = (productId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    let newFavorites = [...favorites];
    const index = favorites.indexOf(productId);
    
    if (index !== -1) {
      newFavorites.splice(index, 1);
    } else {
      newFavorites.push(productId);
    }

    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite, showAuthModal, setShowAuthModal }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
