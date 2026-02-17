# DevClean Assets

This folder contains images and media for the README.

## Required Images

1. **banner.png** — Main banner image (1200x400px)
2. **demo.gif** — Terminal demo animation
3. **screenshot-scan.png** — Scan results screenshot
4. **screenshot-clean.png** — Clean operation screenshot
5. **screenshot-stats.png** — Statistics dashboard

## How to Create

### Banner (banner.png)
Use https://www.canva.com or Figlet + screenshot:
```bash
figlet -f "ANSI Shadow" "DevClean" | tee banner.txt
```

### Demo GIF (demo.gif)
Use asciinema:
```bash
asciinema rec demo.cast
asciicast2gif demo.cast demo.gif
```

Or use https://terminalizer.com

### Screenshots
Just take terminal screenshots of:
- devclean scan
- devclean clean
- devclean stats
