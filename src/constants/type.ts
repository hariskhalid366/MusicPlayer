export type MusicFile = {
  id?: string;
  album: string;
  artist: string;
  cover: string;
  duration: number;
  title: string;
  url: string;
  liked?: boolean;
};

export type ListItemProps = {
  item: MusicFile;
  index: number;
  handleTrack: (track: MusicFile) => void;
  isActive?: any;
  playlist?: boolean;
  isSelected?: boolean; // Added isSelected prop
  isPlaying?: boolean;
  selectionModeActive?: boolean; // Added to know if selection mode is on
};

export type PlaylistModalProps = {
  modal: boolean;
  setModal: (value: boolean) => void;
  text: string;
  setText: (value: string) => void;
  createPlaylist: (text: string) => void;
};
