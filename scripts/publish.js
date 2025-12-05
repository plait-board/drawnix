const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const libraries = ['react-board', 'react-text', 'drawnix'];

libraries.forEach(lib => {
  const libPath = path.resolve(__dirname, '../dist', lib);
  
  if (fs.existsSync(libPath)) {
    const pkgPath = path.join(libPath, 'package.json');
    let publishCmd = 'npm publish --access public';
    let versionInfo = '';

    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const version = pkg.version || '';
        versionInfo = version ? ` (version ${version})` : '';
        // 识别带有预发布标识的版本（包含 '-'），使用 next 标签
        if (typeof version === 'string' && version.includes('-')) {
          publishCmd += ' --tag next';
        }
      } catch (e) {
        console.warn(`Unable to read version for ${lib}:`, e.message);
      }
    } else {
      console.warn(`package.json not found in ${libPath}`);
    }

    console.log(`Publishing ${lib}${versionInfo} with: ${publishCmd}`);
    try {
      execSync(publishCmd, { 
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