import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { MusicFile } from '../constants/type';
import { Alert, LayoutAnimation, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';

const { MusicFiles } = NativeModules;

interface MusicStore {
  audios: MusicFile[];
  favourite: MusicFile[];
  playlists: { id: string; songs: MusicFile[] }[];
  isLoading: boolean;
  setLoading: (state: boolean) => void;
  loadAudios: (audio: MusicFile[]) => Promise<void>;
  toggleLike: (data: MusicFile) => Promise<void>;
  addtoPlaylist: (playlistId: string, song: MusicFile) => void;
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  searchAudios: (query: string) => MusicFile[];
  deleteAudio: (data: MusicFile) => Promise<void>;
  getLikedSongs: () => MusicFile[];
  getAllAudios: () => MusicFile[];
}

export const useAudioStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      audios: [],
      favourite: [],
      playlists: [],
      isLoading: false,

      setLoading: (v: boolean) => set({ isLoading: v }),

      loadAudios: async (audioList: MusicFile[]) => {
        set({ isLoading: true, audios: audioList });

        try {
          const favs = get().favourite;

          const updated = audioList.map(song => ({
            ...song,
            liked: favs.some(f => f.url === song.url),
          }));

          set({ audios: updated, isLoading: false });
        } catch (err) {
          set({ audios: audioList, isLoading: false });
        }
      },

      toggleLike: async (item: MusicFile) => {
        const isLiked = get().favourite.some(f => f.url === item.url);

        // Single atomic update → only ONE re-render across all subscribers
        set(state => ({
          favourite: isLiked
            ? state.favourite.filter(f => f.url !== item.url)
            : [...state.favourite, { ...item, liked: true }],
          audios: state.audios.map(m =>
            m.url === item.url ? { ...m, liked: !isLiked } : m,
          ),
        }));
      },

      createPlaylist: (name: string) => {
        const id = name.trim();
        if (!id) return;
        
        const exists = get().playlists.some(p => p.id === id);
        if (exists) return;

        set({
          playlists: [...get().playlists, { id, songs: [] }],
        });
      },

      addtoPlaylist: (playlistId: string, song: MusicFile) => {
        set({
          playlists: get().playlists.map(p => {
            if (p.id === playlistId) {
              const songExists = p.songs.some(s => s.url === song.url);
              if (songExists) return p;
              return { ...p, songs: [...p.songs, song] };
            }
            return p;
          }),
        });
      },

      deletePlaylist: (playlistId: string) => {
        set({
          playlists: get().playlists.filter(p => p.id !== playlistId),
        });
      },
      
      searchAudios: (query: string) => {
        const q = query.toLowerCase();
        return get().audios.filter(
          audio =>
            audio.title.toLowerCase().includes(q) ||
            (audio.artist ?? '').toLowerCase().includes(q),
        );
      },

      deleteAudio: async (item: MusicFile) => {
        Alert.alert('Delete Song', `Remove "${item.title}" permanently?`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                set({ isLoading: true });

                if (item.id) {
                  await MusicFiles.deleteAudioFile(item.id);
                } else {
                  const isExist = await RNFS.exists(item.url);
                  if (isExist) {
                    await RNFS.unlink(item.url);
                  }
                }

                set(state => ({
                  audios: state.audios.filter(a => a.url !== item.url),
                  favourite: state.favourite.filter(f => f.url !== item.url),
                }));

                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );

                const queue = await TrackPlayer.getQueue();
                const trackIndex = queue.findIndex(
                  (t: any) => t.url === item.url,
                );
                if (trackIndex !== -1) {
                  await TrackPlayer.remove(trackIndex);
                }

                return true;
              } catch (err) {
                console.log('Delete failed:', err);
                Alert.alert('Error', 'Failed to delete audio from device');
              } finally {
                set({ isLoading: false });
              }
            },
          },
        ]);
      },

      getAllAudios: () => get().audios,
      getLikedSongs: () => get().favourite,
    }),
    {
      name: 'audio-storage',
      partialize: state => ({
        favourite: state.favourite,
        playlists: state.playlists,
      }),
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
