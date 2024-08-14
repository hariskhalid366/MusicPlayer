import {Event, useTrackPlayerEvents} from 'react-native-track-player';

const event = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackActiveTrackChanged,
];

export const useLogTrackPlayerState = () => {
  useTrackPlayerEvents(event, async event => {
    if (event.type === Event.PlaybackError) {
      // console.log('An error occured:', event);
    }
    if (event.type === Event.PlaybackState) {
      // console.log('Playback state:', event.state);
    }
    if (event.type === Event.PlaybackActiveTrackChanged) {
      // console.log('Track changed:', event.index);
    }
  });
};
