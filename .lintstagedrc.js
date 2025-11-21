import path from 'path';

function getPackageDir(file) {
  if (file.startsWith('apps/')) {
    const match = file.match(/^apps\/([^/]+)/);
    return match ? `apps/${match[1]}` : null;
  }
  if (file.startsWith('packages/')) {
    const match = file.match(/^packages\/([^/]+)/);
    return match ? `packages/${match[1]}` : null;
  }
  return null;
}

export default {
  '*.{ts,tsx,js,jsx}': (filenames) => {
    const commands = [];

    // Format all files with prettier first
    commands.push(`prettier --write ${filenames.join(' ')}`);

    // Group files by package and run eslint from each package directory
    const filesByPackage = {};
    filenames.forEach((file) => {
      const pkgDir = getPackageDir(file);
      const key = pkgDir || 'root';
      if (!filesByPackage[key]) {
        filesByPackage[key] = [];
      }
      filesByPackage[key].push(file);
    });

    // Run eslint from each package directory
    Object.entries(filesByPackage).forEach(([pkgDir, files]) => {
      if (pkgDir === 'root') {
        // For root files, skip eslint (no root eslint config)
        return;
      } else {
        // For package files, run eslint from the package directory
        const relativeFiles = files.map((f) => path.relative(pkgDir, f));
        commands.push(
          `cd ${pkgDir} && pnpm exec eslint --fix ${relativeFiles.join(' ')}`,
        );
      }
    });

    return commands;
  },
  '*.{json,md,css}': ['prettier --write'],
};
