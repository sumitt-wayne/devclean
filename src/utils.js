/**
 * Utility Functions
 */

const fs = require('fs');
const path = require('path');

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get folder size recursively
 */
function getFolderSize(folderPath) {
  let totalSize = 0;

  try {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          totalSize += getFolderSize(filePath);
        } else {
          totalSize += stats.size;
        }
      } catch (err) {
        // Skip files we can't access
        continue;
      }
    }
  } catch (err) {
    // Skip folders we can't access
  }

  return totalSize;
}

/**
 * Get last modified date
 */
function getLastModified(folderPath) {
  try {
    const stats = fs.statSync(folderPath);
    return stats.mtime;
  } catch (err) {
    return new Date();
  }
}

/**
 * Check if folder is older than X months
 */
function isOlderThan(folderPath, months = 3) {
  const lastModified = getLastModified(folderPath);
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - months);
  return lastModified < monthsAgo;
}

/**
 * Get version from package.json
 */
function getVersion() {
  try {
    const packageJson = require('../package.json');
    return packageJson.version;
  } catch (err) {
    return '1.0.0';
  }
}

/**
 * Safe delete with permission check
 */
function safeDelete(targetPath) {
  try {
    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      if (stats.isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(targetPath);
      }
      return true;
    }
  } catch (err) {
    console.error(`Failed to delete ${targetPath}:`, err.message);
    return false;
  }
  return false;
}

/**
 * Get common developer directories
 */
function getDevDirectories() {
  const home = process.env.HOME || process.env.USERPROFILE;
  const platform = process.platform;

  const directories = [
    path.join(home, 'Downloads'),
    path.join(home, 'Desktop'),
    path.join(home, 'Documents'),
    path.join(home, 'Projects'),
    path.join(home, 'Code'),
    path.join(home, 'workspace')
  ];

  // Add platform-specific directories
  if (platform === 'darwin') {
    directories.push(path.join(home, 'Developer'));
  }

  return directories.filter(dir => fs.existsSync(dir));
}

module.exports = {
  formatBytes,
  getFolderSize,
  getLastModified,
  isOlderThan,
  getVersion,
  safeDelete,
  getDevDirectories
};
