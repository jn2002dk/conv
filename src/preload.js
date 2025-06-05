const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  convertImage: (options) => ipcRenderer.invoke('convert-image', options),
  getImageInfo: (filePath) => ipcRenderer.invoke('get-image-info', filePath)
});