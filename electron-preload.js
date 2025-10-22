const { contextBridge } = require('electron');

// 如果需要,可以在这里暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electron', {
  // 示例: 可以添加需要的 API
  // getVersion: () => process.versions.electron
});
