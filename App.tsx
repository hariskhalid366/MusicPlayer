import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Route from './src/navigation/Route';
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Route />
    </GestureHandlerRootView>
  );
};

export default App;
