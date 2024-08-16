import TrackPlayer from 'react-native-track-player';
import {MusicFile} from '../components/ListView';

export const handleTrackPlayerSong = async (
  selectedTrack: any,
  songs: MusicFile[],
  id: string,
  queueId: string | undefined,
  setQueueId: (id: string) => void,
  queueOffset: number,
  setLoading: (loading: boolean) => void,
) => {
  const trackIndex = songs?.findIndex(track => track.url === selectedTrack.url);

  queueOffset = trackIndex;
  if (trackIndex === -1) return;

  const isChangingQueue = id !== queueId;

  if (isChangingQueue) {
    setLoading(true);
    await TrackPlayer.reset();

    const newTrackQueue = [
      ...songs.slice(0, trackIndex),
      selectedTrack,
      ...songs.slice(trackIndex + 1),
    ];

    await TrackPlayer.add(newTrackQueue);

    await TrackPlayer.skip(trackIndex);
    await TrackPlayer.play();

    setLoading(false);

    queueOffset = trackIndex;

    setQueueId(id);
  } else {
    await TrackPlayer.skip(trackIndex);
    await TrackPlayer.play();
  }
};
