import {useEffect, useRef} from 'react';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';

const setupTrack = async () => {
  await TrackPlayer.setupPlayer({
    maxCacheSize: 1024 * 50,
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
};

interface SetupTrackPlayer {
  onLoad?: () => void;
  Track: any;
}

export const useSetupTrackPlayer = ({onLoad, Track}: SetupTrackPlayer) => {
  const isInitialize = useRef(false);

  useEffect(() => {
    setupTrack()
      .then(() => {
        isInitialize.current = true;
        onLoad?.();
        TrackPlayer.add(Track);
      })
      .catch(err => {
        isInitialize.current = false;
        console.log(err);
      });
  }, [onLoad]);
};
