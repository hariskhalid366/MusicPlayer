import { create } from "zustand";
import { MusicFile } from "../constants/type";

interface BearState {
  isVisible: boolean;
  setIsVisible: (status: boolean) => void;
  currentTrack: MusicFile | null;
  setCurrentTrack: (track: MusicFile | null) => void;
}

const useBearState = create<BearState>((set) => ({
  isVisible: false,
  currentTrack:null,
  setIsVisible: (status) => set({ isVisible: status }),
  setCurrentTrack:(status)=>set({
    currentTrack:status
  }),
}));

export default useBearState;