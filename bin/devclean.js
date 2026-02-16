#!/usr/bin/env node

/**
 * DevClean - Premium CLI Entry Point
 */

const { program } = require('commander');
const inquirer = require('inquirer');
const { scanSystem } = require('../src/scan');
const { cleanJunk } = require('../src/clean');
const { clearCache } = require('../src/cache');
const { findDuplicates } = require('../src/duplicate');
const { organizeFiles } = require('../src/organize');
const { getVersion } = require('../src/utils');
const { loadStats } = require('../src/stats');
const { showWelcomeBanner, showStatsDashboard } = require('../src/ui');

// Version
program.version(getVersion(), '-v, --version', 'Output the current version');

// Command: scan
program
  .command('scan')
  .description('Scan system for unused files and folders')
  .option('-d, --depth <number>', 'Scan depth', '3')
  .action(async (options) => {
    try {
      await scanSystem(parseInt(options.depth));
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  });

// Command: clean
program
  .command('clean')
  .description('Clean unused node_modules and build folders')
  .option('--dry-run', 'Preview what will be deleted')
  .action(async (options) => {
    try {
      await cleanJunk(options.dryRun);
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  });

// Command: cache
program
  .command('cache')
  .description('Clear npm/yarn/pnpm cache')
  .action(async () => {
    try {
      await clearCache();
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  });

// Command: duplicates
program
  .command('duplicates')
  .description('Find and remove duplicate files')
  .option('-p, --path <path>', 'Path to scan', process.env.HOME || process.env.USERPROFILE)
  .action(async (options) => {
    try {
      await findDuplicates(options.path);
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  });

// Command: organize
program
  .command('organize')
  .description('Organize Downloads folder')
  .action(async () => {
    try {
      await organizeFiles();
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  });

// Command: stats
program
  .command('stats')
  .description('Show DevClean statistics')
  .action(() => {
    const stats = loadStats();
    showStatsDashboard(stats);
  });

// Interactive menu
async function showInteractiveMenu() {
  showWelcomeBanner();

  // Main loop
  while (true) {
    console.log();
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '🎯 What would you like to do?',
        choices: [
          { name: '🔍 Scan System', value: 'scan' },
          { name: '🧹 Clean Junk Files', value: 'clean' },
          { name: '🗑️  Clear Cache', value: 'cache' },
          { name: '🔎 Find Duplicates', value: 'duplicates' },
          { name: '📁 Organize Downloads', value: 'organize' },
          { name: '📊 View Statistics', value: 'stats' },
          { name: '❌ Exit', value: 'exit' }
        ],
        pageSize: 10
      }
    ]);

    console.log(); // Add spacing

    try {
      switch (action) {
        case 'scan':
          await scanSystem(3);
          break;
        case 'clean':
          await cleanJunk(false);
          break;
        case 'cache':
          await clearCache();
          break;
        case 'duplicates':
          await findDuplicates(process.env.HOME || process.env.USERPROFILE);
          break;
        case 'organize':
          await organizeFiles();
          break;
        case 'stats':
          const stats = loadStats();
          showStatsDashboard(stats);
          break;
        case 'exit':
          console.log('\n👋 Thank you for using DevClean!\n');
          process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }

    // Ask if user wants to continue
    console.log();
    const { continue: shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: '🔄 Return to main menu?',
        default: true
      }
    ]);

    if (!shouldContinue) {
      console.log('\n👋 Thank you for using DevClean!\n');
      process.exit(0);
    }

    console.clear(); // Clear screen before showing menu again
    showWelcomeBanner();
  }
}

// Run
if (process.argv.length === 2) {
  showInteractiveMenu().catch(console.error);
} else {
  program.parse(process.argv);
}
