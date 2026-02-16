/**
 * Statistics Tracking
 */

const fs = require('fs');
const path = require('path');

const STATS_FILE = path.join(__dirname, '../config/stats.json');

/**
 * Load stats
 */
function loadStats() {
  try {
    if (fs.existsSync(STATS_FILE)) {
      return JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    }
  } catch (err) {
    // Ignore errors
  }

  return {
    totalScans: 0,
    totalCleans: 0,
    totalSpaceFreed: 0,
    lastScan: null,
    lastClean: null
  };
}

/**
 * Save stats
 */
function saveStats(stats) {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch (err) {
    // Ignore errors
  }
}

/**
 * Update scan stats
 */
function recordScan() {
  const stats = loadStats();
  stats.totalScans++;
  stats.lastScan = new Date().toISOString();
  saveStats(stats);
}

/**
 * Update clean stats
 */
function recordClean(spaceFreed) {
  const stats = loadStats();
  stats.totalCleans++;
  stats.totalSpaceFreed += spaceFreed;
  stats.lastClean = new Date().toISOString();
  saveStats(stats);
}

module.exports = {
  loadStats,
  recordScan,
  recordClean
};
