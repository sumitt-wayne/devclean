# Contributing to DevClean

Thank you for considering contributing to DevClean! 🎉

## How to Contribute

### Reporting Bugs

1. **Check existing issues** — Search [issues](https://github.com/sumitt-wayne/devclean/issues) first
2. **Create detailed report** — Include:
   - Operating system and version
   - Node.js version (`node -v`)
   - DevClean version (`devclean -v`)
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages and logs

### Suggesting Enhancements

1. Open an issue with `enhancement` label
2. Clearly describe the feature
3. Explain the use case
4. Provide examples if possible

### Pull Requests

1. **Fork** the repository
2. **Create branch** from `main`:
```bash
   git checkout -b feature/my-feature
```
3. **Make changes** — Follow code style
4. **Test thoroughly** — All commands should work
5. **Commit** with clear message:
```bash
   git commit -m "Add: feature description"
```
6. **Push** to your fork:
```bash
   git push origin feature/my-feature
```
7. **Open Pull Request** — Link related issues

## Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/devclean.git
cd devclean

# Install dependencies
npm install

# Link for local testing
npm link

# Test
devclean
```

## Code Style

- Use **2 spaces** for indentation
- Use **semicolons**
- Use **single quotes** for strings
- Add **comments** for complex logic
- Follow existing patterns

## Testing Checklist

Before submitting PR, test:

- [ ] `devclean` — Interactive menu works
- [ ] `devclean scan` — Scanning completes
- [ ] `devclean clean --dry-run` — Preview works
- [ ] `devclean clean` — Actual cleaning works
- [ ] `devclean cache` — Cache clearing works
- [ ] `devclean duplicates` — Duplicate detection works
- [ ] `devclean organize` — File organization works
- [ ] `devclean stats` — Statistics display
- [ ] `devclean -v` — Version shows correctly

## Commit Message Format
```
Type: Short description

Longer description if needed

Fixes #123
```

**Types:**
- `Add:` — New feature
- `Fix:` — Bug fix
- `Update:` — Changes to existing feature
- `Remove:` — Removed feature
- `Docs:` — Documentation only
- `Style:` — Formatting, no code change
- `Refactor:` — Code restructuring
- `Test:` — Adding tests
- `Chore:` — Build process, dependencies

## Questions?

Open an issue or discussion on GitHub!

---

**Thank you for contributing! 🚀**
