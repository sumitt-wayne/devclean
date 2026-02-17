# DevClean

A CLI tool to clean unused `node_modules`, build folders, cache, and duplicate files — and reclaim gigabytes of storage in seconds.

[![npm version](https://img.shields.io/npm/v/dev-storage-clean.svg)](https://www.npmjs.com/package/dev-storage-clean)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org)

---

## What It Does

- Finds unused `node_modules` folders older than 3 months
- Removes build artifacts like `dist`, `build`, `.next`
- Clears npm, yarn, and pnpm cache
- Detects and removes duplicate files
- Organizes your Downloads folder by file type
- Shows how much space you can recover

---

## Installation

```bash
npm install -g dev-storage-clean
```

---

## Usage

### Interactive Mode

Run without any arguments to open the menu:

```bash
devclean
```

```
? What would you like to do?
❯ 🔍 Scan System
  🧹 Clean Junk Files
  🗑️  Clear Cache
  🔎 Find Duplicates
  📁 Organize Downloads
  📊 View Statistics
  ❌ Exit
```

Use arrow keys to navigate, Enter to select.

---

### Commands

#### `devclean scan`
Scan your system and show what can be cleaned.

```bash
devclean scan
```

Output:
```
┌───────────────────┬───────┬──────────┬────────────┐
│ Category          │ Items │ Size     │ Status     │
├───────────────────┼───────┼──────────┼────────────┤
│ 📦 node_modules   │ 15    │ 3.40 GB  │ 5 old      │
│ 🏗️  Build Folders │ 6     │ 1.41 GB  │ Can clean  │
└───────────────────┴───────┴──────────┴────────────┘

Total Recoverable: 4.81 GB
```

Options:
```bash
devclean scan --depth 5   # Scan deeper (default: 3)
```

---

#### `devclean clean`
Delete unused files. Always shows a preview and asks for confirmation before deleting anything.

```bash
# Preview only — nothing gets deleted
devclean clean --dry-run

# Actually clean (asks for confirmation)
devclean clean
```

What gets deleted:
- `node_modules` folders not touched in 3+ months
- Build folders: `dist`, `build`, `.next`, `.nuxt`, `out`
- Log files: `.log`
- Temp files: `.tmp`, `.cache`

---

#### `devclean cache`
Clear package manager cache.

```bash
devclean cache
```

Supports npm, yarn, and pnpm. You will be asked to choose which ones to clear.

---

#### `devclean duplicates`
Find duplicate files using SHA-256 hashing and remove extras.

```bash
# Scan home directory
devclean duplicates

# Scan a specific folder
devclean duplicates --path ~/Downloads
```

How it works:
1. Reads every file in the folder
2. Generates a hash for each file
3. Groups files with the same hash
4. Shows you the duplicates and asks what to delete

---

#### `devclean organize`
Sort files in your Downloads folder into subfolders by type.

```bash
devclean organize
```

Files are moved into:

| Folder | Extensions |
|--------|------------|
| Images | `.jpg` `.png` `.gif` `.svg` `.webp` |
| Videos | `.mp4` `.avi` `.mov` `.mkv` |
| Documents | `.pdf` `.doc` `.docx` `.xlsx` `.pptx` |
| Archives | `.zip` `.rar` `.7z` `.tar` `.gz` |
| Audio | `.mp3` `.wav` `.flac` `.aac` |
| Code | `.js` `.ts` `.py` `.html` `.css` |
| Executables | `.exe` `.dmg` `.deb` `.pkg` |
| Others | Everything else |

---

#### `devclean stats`
Show how much you have cleaned over time.

```bash
devclean stats
```

```
┌─────────────────┬─────────────────────┐
│ Metric          │ Value               │
├─────────────────┼─────────────────────┤
│ 🔍 Total Scans  │ 12                  │
│ 🧹 Total Cleans │ 5                   │
│ 💾 Space Freed  │ 23.4 GB             │
│ 📅 Last Scan    │ 2025-01-15 10:30 AM │
│ 🗑️  Last Clean  │ 2025-01-14 02:22 PM │
└─────────────────┴─────────────────────┘
```

---

## Safety

DevClean never deletes without asking.

- **Dry run mode** — preview before any action
- **Confirmation prompt** — always asks yes/no before deleting
- **File preview** — shows exactly which files will be removed
- **Skips system folders** — never touches `.git`, OS files, or critical directories

---

## Troubleshooting

**`devclean: command not found`**

```bash
# Check npm global bin path
npm config get prefix

# Add to your PATH (Linux/Mac)
export PATH="$(npm config get prefix)/bin:$PATH"

# Then reinstall
npm install -g dev-storage-clean
```

**Permission denied when cleaning**

```bash
# Fix folder permissions first
chmod -R 755 /path/to/folder

# Or run with sudo (use carefully)
sudo devclean clean
```

**Scan is too slow**

```bash
# Use a smaller depth value
devclean scan --depth 2
```

---

## Project Structure

```
devclean/
├── bin/
│   └── devclean.js       # CLI entry point
├── src/
│   ├── scan.js           # Scanning engine
│   ├── clean.js          # Cleaning logic
│   ├── cache.js          # Cache management
│   ├── duplicate.js      # Duplicate detection
│   ├── organize.js       # File organizer
│   ├── stats.js          # Usage statistics
│   ├── ui.js             # Terminal UI
│   └── utils.js          # Helpers
├── config/
│   └── stats.json        # Saved statistics
└── package.json
```

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/sumitt-wayne/devclean.git
cd devclean

# Install dependencies
npm install

# Link for local testing
npm link

# Run
devclean
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and test them
4. Commit: `git commit -m "Add: your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

To report a bug or suggest a feature, open an [issue](https://github.com/sumitt-wayne/devclean/issues).

---

## Built With

- [Commander.js](https://github.com/tj/commander.js) — CLI commands
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) — Interactive prompts
- [Chalk](https://github.com/chalk/chalk) — Terminal colors
- [Ora](https://github.com/sindresorhus/ora) — Spinners
- [cli-progress](https://github.com/npkgz/cli-progress) — Progress bars
- [Boxen](https://github.com/sindresorhus/boxen) — Terminal boxes
- [cli-table3](https://github.com/cli-table/cli-table3) — Tables

---

## License

MIT © [Sumit Wayne](https://github.com/sumitt-wayne)