/**
 * Cache Management
 * Clear npm, yarn, and pnpm cache
 */

const { execSync } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Check if command exists
 */
function commandExists(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear cache
 */
async function clearCache() {
  const availableManagers = [];

  // Check which package managers are installed
  if (commandExists('npm')) availableManagers.push('npm');
  if (commandExists('yarn')) availableManagers.push('yarn');
  if (commandExists('pnpm')) availableManagers.push('pnpm');

  if (availableManagers.length === 0) {
    console.log(chalk.red('❌ No package managers found (npm/yarn/pnpm)'));
    return;
  }

  console.log(chalk.cyan(`Found package managers: ${availableManagers.join(', ')}\n`));

  // Ask which to clear
  const { managers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'managers',
      message: 'Which cache would you like to clear?',
      choices: availableManagers,
      default: availableManagers
    }
  ]);

  if (managers.length === 0) {
    console.log(chalk.yellow('No cache selected'));
    return;
  }

  // Confirm
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Clear ${managers.join(', ')} cache?`,
      default: true
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('❌ Cache clearing cancelled'));
    return;
  }

  // Clear cache for each manager
  for (const manager of managers) {
    try {
      console.log(chalk.cyan(`\nClearing ${manager} cache...`));

      switch (manager) {
        case 'npm':
          execSync('npm cache clean --force', { stdio: 'inherit' });
          break;
        case 'yarn':
          execSync('yarn cache clean', { stdio: 'inherit' });
          break;
        case 'pnpm':
          execSync('pnpm store prune', { stdio: 'inherit' });
          break;
      }

      console.log(chalk.green(`✓ ${manager} cache cleared`));
    } catch (error) {
      console.error(chalk.red(`✗ Failed to clear ${manager} cache:`, error.message));
    }
  }

  console.log(chalk.green.bold('\n✅ Cache clearing complete!\n'));
}

module.exports = {
  clearCache
};
