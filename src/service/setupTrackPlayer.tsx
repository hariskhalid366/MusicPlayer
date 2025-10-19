import { useEffect, useRef } from 'react';
import TrackPlayer, {
  AndroidAudioContentType,
  RepeatMode,
} from 'react-native-track-player';

interface SetupTrackPlayer {
  onLoad?: () => void;
  Track?: any;
}

const setupTrack = async () => {
    try {
      await TrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 30,
        androidAudioContentType: AndroidAudioContentType.Sonification,
        backBuffer:5,
        playBuffer:5,
        maxBuffer:100
      });

      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      console.log('Track Player setup complete');
      return undefined;
    } catch (error: any) {
      console.log('Error setting up Track Player:', error);
      return error?.code;
    }
};

export const useSetupTrackPlayer = ({ onLoad, Track }: SetupTrackPlayer) => {
  const isInitialized = useRef(false);
  const hasAddedTrack = useRef(false);

  useEffect(() => {
    const initializePlayer = async () => {
      if (!isInitialized.current) {
        try {
          await setupTrack();
          isInitialized.current = true;
          console.log('Track player initialized');

          if (onLoad) onLoad();
        } catch (err) {
          console.log('Initialization error:', err);
          isInitialized.current = false;
        }
      }

      if (Track && !hasAddedTrack.current) {
        try {
          await TrackPlayer.add(Track);
          hasAddedTrack.current = true;
          console.log('Tracks added to player');
        } catch (err) {
          console.log('Error adding tracks:', err);
        }
      }
    };

    initializePlayer();

    return () => {
      hasAddedTrack.current = false;
    };
  }, [onLoad, Track]);
};


// import {useEffect, useRef} from 'react';
// import TrackPlayer, {
//   AndroidAudioContentType,
//   RepeatMode,
// } from 'react-native-track-player';

// const setupTrack = async () => {
//   await TrackPlayer.setupPlayer({
//       maxCacheSize: 1024 * 30,
//       androidAudioContentType: AndroidAudioContentType.Sonification,
//       backBuffer:20,
//       playBuffer:60,
//       maxBuffer:100
//   });
//   await TrackPlayer.setRepeatMode(RepeatMode.Queue);
// };

// interface SetupTrackPlayer {
//   onLoad?: () => void;
//   Track: any;
// }

// export const useSetupTrackPlayer = ({onLoad, Track}: SetupTrackPlayer) => {
//   const isInitialize = useRef(false);

//   useEffect(() => {
//     setupTrack()
//       .then(() => {
//         isInitialize.current = true;
//         onLoad?.();
//         TrackPlayer.add(Track);
//       })
//       .catch(err => {
//         isInitialize.current = false;
//         console.log(err);
//       });
//   }, [onLoad]);
// };