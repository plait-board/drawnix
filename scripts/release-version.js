const { execSync } = require('child_process');

// Run nx release version
execSync('nx release version', { stdio: 'inherit' });

// Get the new version from react-text/package.json
const version = require('../packages/react-text/package.json').version;

// Run nx release changelog
execSync(`nx release changelog ${version}`, { stdio: 'inherit' });

// Commit all changes with a single commit message
execSync('git add .', { stdio: 'inherit' });
execSync(`git commit -m "chore(release): publish ${version}"`, { stdio: 'inherit' });

// Create a Git tag for the release
execSync(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit' });
