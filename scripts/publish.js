const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const libraries = ['react-board', 'react-text', 'drawnix'];

libraries.forEach(lib => {
  const libPath = path.resolve(__dirname, '../dist', lib);
  
  if (fs.existsSync(libPath)) {
    console.log(`Publishing ${lib}...`);
    try {
      execSync('npm publish --access public', { 
        cwd: libPath,
        stdio: 'inherit'
      });
      console.log(`Successfully published ${lib}`);
    } catch (error) {
      console.error(`Failed to publish ${lib}:`, error);
    }
  } else {
    console.error(`Library path not found: ${libPath}`);
  }
});