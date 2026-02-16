# 🚀 DevClean

> A powerful CLI tool to clean unused `node_modules`, cache, and optimize developer storage

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## ✨ Features

- 🔍 **Smart Scanning** - Find unused `node_modules`, build folders, and temp files
- 🧹 **Safe Cleaning** - Preview before delete with confirmation
- 🗑️  **Cache Management** - Clear npm/yarn/pnpm cache
- 🔎 **Duplicate Detection** - Find and remove duplicate files
- 📁 **File Organization** - Auto-organize Downloads by file type
- 💾 **Space Recovery** - Free up gigabytes of storage
- 🖥️  **Cross-Platform** - Works on Windows, macOS, and Linux
- ⚡ **Fast & Efficient** - Optimized performance

## 📦 Installation

### Global Installation (Recommended)

\`\`\`bash
npm install -g @devtools/devclean
\`\`\`

### Local Development

\`\`\`bash
git clone https://github.com/yourusername/devclean.git
cd devclean
npm install
npm link
\`\`\`

## 🚀 Usage

### Interactive Mode

\`\`\`bash
devclean
\`\`\`

### Commands

\`\`\`bash
# Scan system
devclean scan

# Clean junk files
devclean clean

# Dry run (preview only)
devclean clean --dry-run

# Clear cache
devclean cache

# Find duplicates
devclean duplicates

# Organize Downloads
devclean organize

# Show version
devclean -v
\`\`\`

## 📊 What Gets Cleaned?

- ✅ Unused `node_modules` (older than 3 months)
- ✅ Build folders (`dist`, `build`, `.next`, etc.)
- ✅ Log files (`.log`)
- ✅ Temp files (`.tmp`, `.cache`)
- ✅ npm/yarn/pnpm cache
- ✅ Duplicate files

## 🛡️ Safety Features

- **Preview Mode** - See what will be deleted before confirming
- **Dry Run** - Test without actually deleting
- **Confirmation Prompts** - Always ask before deleting
- **Smart Detection** - Only targets old/unused files
- **Error Handling** - Gracefully handles permission errors

## 🎯 Use Cases

- Clean up old projects before archiving
- Free storage space on your development machine
- Organize messy Downloads folder
- Find and remove duplicate files
- Clear package manager caches

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT © [Your Name]

## 🙏 Acknowledgments

Built with:
- [Commander.js](https://github.com/tj/commander.js/) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling

## 📧 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/devclean/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/devclean/discussions)
- 🐦 **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

---

Made with ❤️ by developers, for developers
