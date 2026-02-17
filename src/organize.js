const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { showSuccessBox, showInfoBox, createProgressBar } = require('./ui');

const FILE_CATEGORIES = {
  Images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico'],
  Videos: ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm'],
  Documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.xls', '.xlsx', '.ppt', '.pptx'],
  Archives: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
  Code: ['.js', '.ts', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.html', '.css'],
  Audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
  Executables: ['.exe', '.msi', '.dmg', '.pkg', '.deb', '.rpm', '.app']
};

function getCategory(filename) {
  const ext = path.extname(filename).toLowerCase();
  for (const [category, extensions] of Object.entries(FILE_CATEGORIES)) {
    if (extensions.includes(ext)) {
      return category;
    }
  }
  return 'Others';
}

async function organizeFiles() {
  const home = process.env.HOME || process.env.USERPROFILE;
  const downloadsPath = path.join(home, 'Downloads');

  if (!fs.existsSync(downloadsPath)) {
    console.log(chalk.red('❌ Downloads folder not found'));
    return;
  }

  console.log(chalk.cyan(`📂 Scanning: ${downloadsPath}\n`));

  try {
    const files = fs.readdirSync(downloadsPath);
    const regularFiles = files.filter(file => {
      const filePath = path.join(downloadsPath, file);
      try {
        return fs.statSync(filePath).isFile();
      } catch (e) {
        return false;
      }
    });

    if (regularFiles.length === 0) {
      showSuccessBox('All Clean!', 'Downloads folder is already organized! 🎉');
      return;
    }

    const categorized = {};
    for (const file of regularFiles) {
      const category = getCategory(file);
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(file);
    }

    showInfoBox(
      'Files to Organize',
      Object.entries(categorized)
        .map(([cat, files]) => `${cat}: ${files.length} files`)
        .join('\n'),
      'cyan'
    );

    console.log();
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '📁 Organize files into folders?',
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('\n❌ Organization cancelled\n'));
      return;
    }

    console.log();
    const progressBar = createProgressBar('📁 Organizing');
    progressBar.start(regularFiles.length, 0);

    let movedCount = 0;
    let processed = 0;

    for (const [category, fileList] of Object.entries(categorized)) {
      const categoryPath = path.join(downloadsPath, category);

      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath);
      }

      for (const file of fileList) {
        try {
          const sourcePath = path.join(downloadsPath, file);
          let destPath = path.join(categoryPath, file);

          let counter = 1;
          while (fs.existsSync(destPath)) {
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            destPath = path.join(categoryPath, `${basename}_${counter}${ext}`);
            counter++;
          }

          fs.renameSync(sourcePath, destPath);
          movedCount++;
        } catch (err) {
          // Skip files we can't move
        }
        
        processed++;
        progressBar.update(processed);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    progressBar.stop();

    showSuccessBox(
      'Organization Complete!',
      `✨ Successfully organized ${chalk.white.bold(movedCount)} files\n` +
      `📁 Created ${chalk.white.bold(Object.keys(categorized).length)} category folders\n\n` +
      `${chalk.gray('Your Downloads folder is now organized!')}`
    );

  } catch (err) {
    console.error(chalk.red('❌ Error:'), err.message);
  }
}

module.exports = {
  organizeFiles
};
