import React from 'react';
import Route from './src/navigation/Route';
import {LoadingProvider} from './src/constants/GlobalState';
const App = () => {
  return (
    <LoadingProvider>
      <Route />
    </LoadingProvider>
  );
};

export default App;
