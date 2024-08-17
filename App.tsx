import React from 'react';
import Route from './src/navigation/Route';
import {GlobalStateProvider} from './src/constants/PlaylistContextState';
const App = () => {
  return (
    <GlobalStateProvider>
      <Route />
    </GlobalStateProvider>
  );
};

export default App;
