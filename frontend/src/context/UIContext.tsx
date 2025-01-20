import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UIContextState {
  localOverlays: {
    [key: string]: boolean;
  };
  tooltips: {
    [key: string]: boolean;
  };
  focusedElement: string | null;
}

interface UIContextValue extends UIContextState {
  toggleOverlay: (id: string) => void;
  showTooltip: (id: string) => void;
  hideTooltip: (id: string) => void;
  setFocusedElement: (id: string | null) => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, setState] = useState<UIContextState>({
    localOverlays: {},
    tooltips: {},
    focusedElement: null,
  });

  const toggleOverlay = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      localOverlays: {
        ...prev.localOverlays,
        [id]: !prev.localOverlays[id],
      },
    }));
  }, []);

  const showTooltip = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tooltips: {
        ...prev.tooltips,
        [id]: true,
      },
    }));
  }, []);

  const hideTooltip = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tooltips: {
        ...prev.tooltips,
        [id]: false,
      },
    }));
  }, []);

  const setFocusedElement = useCallback((id: string | null) => {
    setState((prev) => ({
      ...prev,
      focusedElement: id,
    }));
  }, []);

  const value = {
    ...state,
    toggleOverlay,
    showTooltip,
    hideTooltip,
    setFocusedElement,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
