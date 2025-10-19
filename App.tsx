import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css"
import Route from './src/navigation/Route';
const App = () => {
  return (
    <GestureHandlerRootView>
      <Route />
    </GestureHandlerRootView>
  );
};

export default App;
