/**
 * Duplicate File Detection
 * Find and remove duplicate files using file hashing
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { formatBytes, safeDelete } = require('./utils');

/**
 * Calculate file hash
 */
function getFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (err) {
    return null;
  }
}

/**
 * Scan directory for files
 */
function scanForFiles(dirPath, maxDepth = 3, currentDepth = 0) {
  const files = [];

  if (currentDepth > maxDepth) return files;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);

      try {
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          // Skip system and node_modules
          if (item === 'node_modules' || item.startsWith('.')) continue;
          files.push(...scanForFiles(itemPath, maxDepth, currentDepth + 1));
        } else if (stats.isFile()) {
          // Only check files larger than 1KB
          if (stats.size > 1024) {
            files.push({
              path: itemPath,
              size: stats.size
            });
          }
        }
      } catch (err) {
        continue;
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }

  return files;
}

/**
 * Find duplicate files
 */
async function findDuplicates(searchPath) {
  console.log(chalk.cyan(`Scanning: ${searchPath}\n`));

  // Scan for files
  const files = scanForFiles(searchPath);

  if (files.length === 0) {
    console.log(chalk.yellow('No files found'));
    return;
  }

  console.log(chalk.gray(`Found ${files.length} files, calculating hashes...\n`));

  // Calculate hashes
  const hashMap = new Map();
  let processedCount = 0;

  for (const file of files) {
    const hash = getFileHash(file.path);
    if (hash) {
      if (!hashMap.has(hash)) {
        hashMap.set(hash, []);
      }
      hashMap.get(hash).push(file);
    }

    processedCount++;
    if (processedCount % 100 === 0) {
      process.stdout.write(`\rProcessed: ${processedCount}/${files.length}`);
    }
  }

  console.log('\n');

  // Find duplicates
  const duplicates = [];
  for (const [hash, fileList] of hashMap) {
    if (fileList.length > 1) {
      duplicates.push({
        hash,
        files: fileList
      });
    }
  }

  if (duplicates.length === 0) {
    console.log(chalk.green('✅ No duplicate files found!'));
    return;
  }

  // Display duplicates
  console.log(chalk.yellow.bold(`\n📋 Found ${duplicates.length} sets of duplicates:\n`));

  let totalWastedSpace = 0;

  duplicates.slice(0, 5).forEach((dup, index) => {
    console.log(chalk.cyan(`Set ${index + 1}:`));
    dup.files.forEach((file, fileIndex) => {
      console.log(chalk.gray(`  ${fileIndex + 1}. ${file.path} (${formatBytes(file.size)})`));
      if (fileIndex > 0) {
        totalWastedSpace += file.size;
      }
    });
    console.log('');
  });

  if (duplicates.length > 5) {
    console.log(chalk.gray(`... and ${duplicates.length - 5} more sets\n`));
  }

  console.log(chalk.yellow(`Total wasted space: ${formatBytes(totalWastedSpace)}\n`));

  // Ask to delete
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🗑️  Delete duplicates (keep oldest)', value: 'delete' },
        { name: '📋 Show full list', value: 'list' },
        { name: '❌ Cancel', value: 'cancel' }
      ]
    }
  ]);

  if (action === 'cancel') {
    console.log(chalk.yellow('Operation cancelled'));
    return;
  }

  if (action === 'list') {
    duplicates.forEach((dup, index) => {
      console.log(chalk.cyan(`\nSet ${index + 1}:`));
      dup.files.forEach((file, fileIndex) => {
        console.log(chalk.gray(`  ${fileIndex + 1}. ${file.path} (${formatBytes(file.size)})`));
      });
    });
    return;
  }

  if (action === 'delete') {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to delete duplicates?',
        default: false
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Deletion cancelled'));
      return;
    }

    // Delete duplicates (keep first/oldest)
    console.log(chalk.cyan('\n🗑️  Deleting duplicates...\n'));

    let deletedCount = 0;
    let freedSpace = 0;

    for (const dup of duplicates) {
      // Keep first file, delete rest
      for (let i = 1; i < dup.files.length; i++) {
        const file = dup.files[i];
        const success = safeDelete(file.path);
        if (success) {
          deletedCount++;
          freedSpace += file.size;
          console.log(chalk.green(`✓ Deleted: ${file.path}`));
        }
      }
    }

    console.log(chalk.green.bold(`\n✅ Deletion complete!`));
    console.log(chalk.yellow(`Deleted ${deletedCount} duplicate files`));
    console.log(chalk.yellow(`Freed ${formatBytes(freedSpace)} of space\n`));
  }
}

module.exports = {
  findDuplicates
};
