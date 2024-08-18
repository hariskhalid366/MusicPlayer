import TrackPlayer from 'react-native-track-player';
import {MusicFile} from '../components/ListView';

export const handleTrackPlayerSong = async (
  selectedTrack: MusicFile,
  songs: MusicFile[],
  id: string,
  queueId: string | undefined,
  setQueueId: (id: string) => void,
  setLoading: (loading: boolean) => void,
) => {
  try {
    const trackIndex = songs?.findIndex(
      track => track.url === selectedTrack.url,
    );

    if (trackIndex === -1) {
      return;
    }

    const isChangingQueue = id !== queueId;

    if (isChangingQueue) {
      setLoading(true);

      await TrackPlayer.reset(),
        await TrackPlayer.add(songs),
        await TrackPlayer.skip(trackIndex),
        setLoading(false);

      setQueueId(id);
    } else {
      await TrackPlayer.skip(trackIndex);
    }
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error handling track change:', error);
  }
};
