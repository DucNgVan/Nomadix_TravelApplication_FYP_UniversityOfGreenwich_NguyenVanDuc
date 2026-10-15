// Setup env shim for Jest with React Native 0.86
try {
  const { NativeModules } = require('react-native');
  if (NativeModules && NativeModules.StatusBarManager) {
    NativeModules.StatusBarManager.setNetworkActivityIndicatorVisible = jest.fn();
    NativeModules.StatusBarManager.setColor = jest.fn();
    NativeModules.StatusBarManager.setStyle = jest.fn();
    NativeModules.StatusBarManager.setHidden = jest.fn();
  }
} catch (e) {}

try {
  const NativeStatusBarManagerIOS = require('react-native/src/private/specs_DEPRECATED/modules/NativeStatusBarManagerIOS').default;
  if (NativeStatusBarManagerIOS) {
    NativeStatusBarManagerIOS.setNetworkActivityIndicatorVisible = jest.fn();
  }
} catch (e) {}

module.exports = {};
