/**
 * Premium UI Engine for DevClean
 * Beautiful terminal interface
 */

const chalk = require('chalk');
const ora = require('ora');
const cliProgress = require('cli-progress');
const boxen = require('boxen');
const figlet = require('figlet');
const gradient = require('gradient-string');
const Table = require('cli-table3');

/**
 * Show welcome banner with animation
 */
function showWelcomeBanner() {
  console.clear();
  const banner = figlet.textSync('DevClean', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default'
  });
  
  console.log(gradient.pastel.multiline(banner));
  console.log();
  console.log(boxen(
    chalk.white.bold('🚀 Ultimate Developer Storage Optimizer\n') +
    chalk.gray('Clean • Optimize • Organize • Analyze'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      align: 'center'
    }
  ));
  console.log();
}

/**
 * Show loading spinner
 */
function createSpinner(text, color = 'cyan') {
  return ora({
    text: chalk[color](text),
    spinner: 'dots12',
    color: color
  });
}

/**
 * Create progress bar
 */
function createProgressBar(label = 'Progress') {
  return new cliProgress.SingleBar({
    format: chalk.cyan(`${label} |`) + chalk.yellow('{bar}') + chalk.cyan('| {percentage}% | {value}/{total} files'),
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  }, cliProgress.Presets.shades_classic);
}

/**
 * Show success box
 */
function showSuccessBox(title, content) {
  console.log();
  console.log(boxen(
    chalk.green.bold('✅ ' + title + '\n\n') +
    chalk.white(content),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green',
      align: 'left'
    }
  ));
}

/**
 * Show error box
 */
function showErrorBox(title, content) {
  console.log();
  console.log(boxen(
    chalk.red.bold('❌ ' + title + '\n\n') +
    chalk.white(content),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'red',
      align: 'left'
    }
  ));
}

/**
 * Show info box
 */
function showInfoBox(title, content, color = 'cyan') {
  console.log();
  console.log(boxen(
    chalk[color].bold('ℹ️  ' + title + '\n\n') +
    chalk.white(content),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: color,
      align: 'left'
    }
  ));
}

/**
 * Create a beautiful table
 */
function createTable(headers, color = 'cyan') {
  return new Table({
    head: headers.map(h => chalk[color].bold(h)),
    style: {
      head: [],
      border: ['grey']
    },
    chars: {
      'top': '─',
      'top-mid': '┬',
      'top-left': '┌',
      'top-right': '┐',
      'bottom': '─',
      'bottom-mid': '┴',
      'bottom-left': '└',
      'bottom-right': '┘',
      'left': '│',
      'left-mid': '├',
      'mid': '─',
      'mid-mid': '┼',
      'right': '│',
      'right-mid': '┤',
      'middle': '│'
    }
  });
}

/**
 * Show scan results in a beautiful table
 */
function showScanResultsTable(results) {
  console.log();
  console.log(chalk.cyan.bold('📊 Detailed Scan Results'));
  console.log();

  const table = createTable(['Category', 'Items Found', 'Total Size', 'Status']);

  // Node Modules
  if (results.nodeModules && results.nodeModules.length > 0) {
    const totalSize = results.nodeModules.reduce((sum, item) => sum + item.size, 0);
    const oldCount = results.nodeModules.filter(item => item.isOld).length;
    const status = oldCount > 0 ? chalk.yellow(`${oldCount} old`) : chalk.green('All recent');
    
    table.push([
      chalk.yellow('📦 node_modules'),
      chalk.white(results.nodeModules.length),
      chalk.cyan(formatBytes(totalSize)),
      status
    ]);
  }

  // Build Folders
  if (results.buildFolders && results.buildFolders.length > 0) {
    const totalSize = results.buildFolders.reduce((sum, item) => sum + item.size, 0);
    
    table.push([
      chalk.blue('🏗️  Build Folders'),
      chalk.white(results.buildFolders.length),
      chalk.cyan(formatBytes(totalSize)),
      chalk.green('Can clean')
    ]);
  }

  // Log Files
  if (results.logFiles && results.logFiles.length > 0) {
    const totalSize = results.logFiles.reduce((sum, item) => sum + item.size, 0);
    
    table.push([
      chalk.gray('📄 Log Files'),
      chalk.white(results.logFiles.length),
      chalk.cyan(formatBytes(totalSize)),
      chalk.green('Can clean')
    ]);
  }

  // Temp Files
  if (results.tempFiles && results.tempFiles.length > 0) {
    const totalSize = results.tempFiles.reduce((sum, item) => sum + item.size, 0);
    
    table.push([
      chalk.magenta('🗑️  Temp Files'),
      chalk.white(results.tempFiles.length),
      chalk.cyan(formatBytes(totalSize)),
      chalk.green('Can clean')
    ]);
  }

  console.log(table.toString());

  // Summary Box
  showInfoBox(
    'Summary',
    `Total Recoverable Space: ${chalk.green.bold(formatBytes(results.totalSize))}\n` +
    `This is equivalent to:\n` +
    `  • ${Math.floor(results.totalSize / (1024 * 1024 * 5))} HD movies (5GB each)\n` +
    `  • ${Math.floor(results.totalSize / (1024 * 1024))} high-quality photos (1MB each)\n` +
    `  • ${Math.floor(results.totalSize / (1024 * 100))} songs (100KB each)`,
    'yellow'
  );
}

/**
 * Show storage visualization
 */
function showStorageBar(used, total, label = 'Storage') {
  const percentage = Math.floor((used / total) * 100);
  const barLength = 40;
  const filledLength = Math.floor((percentage / 100) * barLength);
  
  let barColor;
  if (percentage < 50) barColor = 'green';
  else if (percentage < 80) barColor = 'yellow';
  else barColor = 'red';

  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  console.log();
  console.log(chalk.white(label));
  console.log(chalk[barColor](bar) + chalk.white(` ${percentage}%`));
  console.log(chalk.gray(`${formatBytes(used)} / ${formatBytes(total)}`));
}

/**
 * Format bytes helper
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
 * Show divider
 */
function showDivider(char = '─', length = 60) {
  console.log(chalk.gray(char.repeat(length)));
}

/**
 * Animate text typing effect
 */
async function typeText(text, delay = 30) {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  console.log();
}

/**
 * Show comparison before/after
 */
function showBeforeAfter(before, after, label) {
  console.log();
  console.log(boxen(
    chalk.white.bold(label + '\n\n') +
    chalk.red('Before: ') + chalk.white(formatBytes(before)) + '\n' +
    chalk.green('After:  ') + chalk.white(formatBytes(after)) + '\n' +
    chalk.yellow('Saved:  ') + chalk.green.bold(formatBytes(before - after)),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'green',
      align: 'left'
    }
  ));
}

/**
 * Show file list with icons
 */
function showFileList(files, maxDisplay = 10) {
  console.log();
  const displayFiles = files.slice(0, maxDisplay);
  
  displayFiles.forEach((file, index) => {
    const icon = getFileIcon(file.path || file);
    const size = file.size ? chalk.gray(` (${formatBytes(file.size)})`) : '';
    console.log(`  ${chalk.cyan(index + 1 + '.')} ${icon} ${chalk.white(file.path || file)}${size}`);
  });

  if (files.length > maxDisplay) {
    console.log(chalk.gray(`  ... and ${files.length - maxDisplay} more`));
  }
  console.log();
}

/**
 * Get icon for file type
 */
function getFileIcon(filePath) {
  if (filePath.includes('node_modules')) return '📦';
  if (filePath.includes('dist') || filePath.includes('build')) return '🏗️';
  if (filePath.includes('.next')) return '⚡';
  if (filePath.endsWith('.log')) return '📄';
  if (filePath.endsWith('.tmp') || filePath.endsWith('.temp')) return '🗑️';
  if (filePath.endsWith('.cache')) return '💾';
  return '📁';
}

/**
 * Show statistics dashboard
 */
function showStatsDashboard(stats) {
  console.log();
  console.log(gradient.pastel('═'.repeat(60)));
  console.log();
  console.log(chalk.cyan.bold('                    📊 DevClean Statistics'));
  console.log();
  console.log(gradient.pastel('═'.repeat(60)));
  console.log();

  const table = createTable(['Metric', 'Value'], 'cyan');

  table.push(
    [chalk.yellow('🔍 Total Scans'), chalk.white.bold(stats.totalScans || 0)],
    [chalk.green('🧹 Total Cleans'), chalk.white.bold(stats.totalCleans || 0)],
    [chalk.blue('💾 Space Freed'), chalk.green.bold(formatBytes(stats.totalSpaceFreed || 0))],
    [chalk.magenta('📅 Last Scan'), chalk.white(stats.lastScan ? new Date(stats.lastScan).toLocaleString() : 'Never')],
    [chalk.cyan('🗑️  Last Clean'), chalk.white(stats.lastClean ? new Date(stats.lastClean).toLocaleString() : 'Never')]
  );

  console.log(table.toString());
  console.log();
}

module.exports = {
  showWelcomeBanner,
  createSpinner,
  createProgressBar,
  showSuccessBox,
  showErrorBox,
  showInfoBox,
  createTable,
  showScanResultsTable,
  showStorageBar,
  formatBytes,
  showDivider,
  typeText,
  showBeforeAfter,
  showFileList,
  showStatsDashboard
};
