const Store = require('./store.js')

const userPreferences = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 1000, height: 1000 }
  }
});

module.exports = userPreferences;
