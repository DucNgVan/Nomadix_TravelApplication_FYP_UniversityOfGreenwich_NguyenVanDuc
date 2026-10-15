let registerRootComponent;
try {
  registerRootComponent = require('expo/src/launch/registerRootComponent').default;
} catch (e) {
  try {
    registerRootComponent = require('expo/build/launch/registerRootComponent').default;
  } catch {
    const { AppRegistry } = require('react-native');
    registerRootComponent = (Component) => AppRegistry.registerComponent('main', () => Component);
  }
}

import App from './App';

registerRootComponent(App);


