import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { MusicFile } from '../constants/type';
import { Alert, LayoutAnimation, InteractionManager } from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';

interface MusicStore {
  audios: MusicFile[];
  favourite: MusicFile[];
  isLoading: boolean;
  setLoading: (state: boolean) => void;
  loadAudios: (audio: MusicFile[]) => Promise<void>;
  toggleLike: (data: MusicFile) => Promise<void>;
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
        console.log(isLiked);

        set({
          favourite: isLiked
            ? get().favourite.filter(f => f.url !== item.url)
            : [...get().favourite, { ...item, liked: !isLiked }],
        });

        set({
          audios: get().audios.map(m =>
            m.url === item.url ? { ...m, liked: !isLiked } : m,
          ),
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
                const isExist = await RNFS.exists(item.url);

                if (isExist) {
                  await RNFS.unlink(item.url).then(data => {
                    console.log(data);
                  });
                }
                set(state => ({
                  audios: state.audios.filter(a => a.url !== item.url),
                  favourite: state.favourite.filter(f => f.url !== item.url),
                }));

                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );

                await TrackPlayer.add(get().audios);
              } catch (err) {
                console.log('Delete failed:', err);
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
        audios: state.audios,
      }),
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
