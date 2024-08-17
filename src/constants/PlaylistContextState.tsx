import React, {createContext, useState, ReactNode, useContext} from 'react';
import {MusicFile} from '../components/ListView';

type GlobalStateContextType = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  currentTrack: MusicFile | null;
  setCurrentTrack: (track: MusicFile | null) => void;
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined,
);

export const GlobalStateProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);

  return (
    <GlobalStateContext.Provider
      value={{isVisible, setIsVisible, currentTrack, setCurrentTrack}}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
