import TrackPlayer from 'react-native-track-player';
import {MusicFile} from '../components/ListView';

export const handleTrackPlayerSong = async (
  selectedTrack: any,
  songs: MusicFile[],
  id: string,
  activeQueueId: string | null,
  setActiveQueueId: (id: string) => void,
  queueOffset: number,
  setLoading: (loading: boolean) => void,
) => {
  const trackIndex = songs?.findIndex(track => track.url === selectedTrack.url);
  console.log(trackIndex + ':Track index');

  queueOffset = trackIndex;

  console.log(queueOffset + ': queue offset');

  if (trackIndex === -1) return;

  const isChangingQueue = id !== activeQueueId;

  if (isChangingQueue) {
    setLoading(true);
    queueOffset = trackIndex;
    await TrackPlayer.reset();

    const beforeTracks = songs.slice(0, trackIndex);
    const afterTracks = songs.slice(trackIndex + 1);

    await TrackPlayer.add(beforeTracks);
    await TrackPlayer.add(selectedTrack);
    await TrackPlayer.add(afterTracks);

    await TrackPlayer.play();
    setLoading(false);

    setActiveQueueId(id);
  } else {
    await TrackPlayer.skip(trackIndex);
    await TrackPlayer.play();
  }
};
