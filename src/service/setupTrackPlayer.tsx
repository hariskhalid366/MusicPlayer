import { useEffect, useRef } from 'react';
import TrackPlayer, {
  AndroidAudioContentType,
  RepeatMode,
} from 'react-native-track-player';
import showToast from '../components/Toast';

interface SetupTrackPlayer {
  onLoad?: () => void;
  Track?: any;
}

const setupTrack = async () => {
  showToast('calling Setup');

  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 30,
        androidAudioContentType: AndroidAudioContentType.Sonification,
      });

      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      console.log('Track Player setup complete');
      return undefined;
    } catch (error: any) {
      console.error('Error setting up Track Player:', error);
      return error?.code;
    }
  };

  // Retry setup if background initialization issue occurs (Android)
  while ((await setup()) === 'android_cannot_setup_player_in_background') {
    console.log("lhjgkhj");
    
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
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
          console.error('Initialization error:', err);
          isInitialized.current = false;
        }
      }

      if (Track && !hasAddedTrack.current) {
        try {
          await TrackPlayer.reset();
          await TrackPlayer.add(Track);
          hasAddedTrack.current = true;
          console.log('Tracks added to player');
        } catch (err) {
          console.error('Error adding tracks:', err);
        }
      }
    };

    initializePlayer();

    return () => {
      hasAddedTrack.current = false;
    };
  }, [onLoad, Track]);
};
