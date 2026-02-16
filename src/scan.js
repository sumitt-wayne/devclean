/**
 * Scanning Engine with Beautiful UI
 */

const fs = require('fs');
const path = require('path');
const { 
  createSpinner, 
  showScanResultsTable,
  showInfoBox 
} = require('./ui');
const { getFolderSize, isOlderThan, getDevDirectories } = require('./utils');
const { recordScan } = require('./stats');

const TARGET_FOLDERS = [
  'node_modules',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'out',
  'coverage',
  '.cache',
  'tmp',
  'temp'
];

const LOG_EXTENSIONS = ['.log', '.logs'];
const TEMP_EXTENSIONS = ['.tmp', '.temp', '.cache'];

/**
 * Scan system for unused files
 */
async function scanSystem(maxDepth = 3) {
  const results = {
    nodeModules: [],
    buildFolders: [],
    logFiles: [],
    tempFiles: [],
    totalSize: 0
  };

  const directories = getDevDirectories();

  // Show scanning info
  showInfoBox(
    'Scanning Directories',
    directories.map((dir, i) => `${i + 1}. ${dir}`).join('\n'),
    'cyan'
  );

  console.log(); // Add spacing

  // Create spinner
  const spinner = createSpinner('🔍 Scanning your system...', 'cyan');
  spinner.start();

  for (let i = 0; i < directories.length; i++) {
    const directory = directories[i];
    spinner.text = `🔍 Scanning ${path.basename(directory)}... (${i + 1}/${directories.length})`;
    await scanDirectory(directory, results, 0, maxDepth);
  }

  spinner.succeed('✅ Scan completed successfully!');

  // Record stats
  recordScan();

  // Display beautiful results
  showScanResultsTable(results);

  return results;
}

/**
 * Recursively scan directory
 */
async function scanDirectory(dirPath, results, currentDepth, maxDepth) {
  if (currentDepth > maxDepth) return;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);

      try {
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          if (TARGET_FOLDERS.includes(item)) {
            const size = getFolderSize(itemPath);
            const isOld = isOlderThan(path.dirname(itemPath), 3);

            if (item === 'node_modules') {
              results.nodeModules.push({
                path: itemPath,
                size,
                isOld
              });
            } else {
              results.buildFolders.push({
                path: itemPath,
                size,
                type: item
              });
            }

            results.totalSize += size;
          } else {
            await scanDirectory(itemPath, results, currentDepth + 1, maxDepth);
          }
        } else if (stats.isFile()) {
          const ext = path.extname(item);

          if (LOG_EXTENSIONS.includes(ext)) {
            results.logFiles.push({
              path: itemPath,
              size: stats.size
            });
            results.totalSize += stats.size;
          } else if (TEMP_EXTENSIONS.includes(ext)) {
            results.tempFiles.push({
              path: itemPath,
              size: stats.size
            });
            results.totalSize += stats.size;
          }
        }
      } catch (err) {
        continue;
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }
}

module.exports = {
  scanSystem
};
