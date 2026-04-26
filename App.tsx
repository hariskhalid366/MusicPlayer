import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Route from './src/navigation/Route';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
const App = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Route />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
