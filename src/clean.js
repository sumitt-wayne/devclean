/**
 * Cleaning Operations with Beautiful UI
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const { scanSystem } = require('./scan');
const { safeDelete, formatBytes } = require('./utils');
const { recordClean } = require('./stats');
const {
  createSpinner,
  createProgressBar,
  showSuccessBox,
  showInfoBox,
  showFileList,
  showBeforeAfter
} = require('./ui');

/**
 * Clean junk files
 */
async function cleanJunk(dryRun = false) {
  // Show scanning spinner
  const spinner = createSpinner('🔍 Analyzing your system...', 'cyan');
  spinner.start();

  const results = await scanSystem(3);
  spinner.stop();

  if (results.totalSize === 0) {
    showSuccessBox('All Clean!', 'No junk files found. Your system is already optimized! 🎉');
    return;
  }

  // Prepare items for deletion
  const itemsToDelete = [
    ...results.nodeModules.filter(item => item.isOld),
    ...results.buildFolders,
    ...results.logFiles,
    ...results.tempFiles
  ];

  if (itemsToDelete.length === 0) {
    showSuccessBox('All Clean!', 'No old files to clean! 🎉');
    return;
  }

  const totalSize = itemsToDelete.reduce((sum, item) => sum + (item.size || 0), 0);

  // Show files to delete
  console.log();
  console.log(chalk.yellow.bold('📋 Files Selected for Cleaning:'));
  showFileList(itemsToDelete, 15);

  showInfoBox(
    'Clean Summary',
    `Total Items: ${chalk.white.bold(itemsToDelete.length)}\n` +
    `Space to Free: ${chalk.green.bold(formatBytes(totalSize))}\n\n` +
    `${dryRun ? chalk.cyan('🔍 DRY RUN MODE - No files will be deleted') : chalk.yellow('⚠️  Files will be permanently deleted')}`,
    dryRun ? 'cyan' : 'yellow'
  );

  if (dryRun) {
    return;
  }

  // Confirm deletion
  console.log();
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow.bold('⚠️  Are you ABSOLUTELY SURE you want to delete these items?'),
      default: false
    }
  ]);

  if (!confirm) {
    console.log();
    console.log(chalk.yellow('❌ Cleaning cancelled. No files were deleted.'));
    return;
  }

  // Start deletion with progress bar
  console.log();
  const progressBar = createProgressBar('🗑️  Deleting');
  progressBar.start(itemsToDelete.length, 0);

  let deletedCount = 0;
  let freedSpace = 0;
  const errors = [];

  for (let i = 0; i < itemsToDelete.length; i++) {
    const item = itemsToDelete[i];
    const success = safeDelete(item.path);
    
    if (success) {
      deletedCount++;
      freedSpace += item.size || 0;
    } else {
      errors.push(item.path);
    }

    progressBar.update(i + 1);
    
    // Small delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  progressBar.stop();

  // Record stats
  recordClean(freedSpace);

  // Show results
  console.log();
  
  if (errors.length > 0) {
    showInfoBox(
      'Cleaning Complete with Warnings',
      `Successfully deleted: ${chalk.green.bold(deletedCount)} items\n` +
      `Failed to delete: ${chalk.red.bold(errors.length)} items\n` +
      `Space freed: ${chalk.green.bold(formatBytes(freedSpace))}`,
      'yellow'
    );
  } else {
    showSuccessBox(
      'Cleaning Complete!',
      `✨ Successfully deleted ${chalk.white.bold(deletedCount)} items\n` +
      `💾 Freed ${chalk.green.bold(formatBytes(freedSpace))} of storage space\n\n` +
      `${chalk.gray('Your system is now optimized!')}`
    );
  }

  showBeforeAfter(totalSize, 0, '💾 Storage Impact');
}

module.exports = {
  cleanJunk
};
