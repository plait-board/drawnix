const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // getVersion: () => process.versions.electron
});
