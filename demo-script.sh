#!/bin/bash

# Demo script for creating DevClean showcase
# Use with asciinema or similar tools

echo "🎬 DevClean Demo"
echo ""
sleep 2

echo "$ devclean"
sleep 1
devclean << EOF
scan
EOF

sleep 3

echo ""
echo "$ devclean scan"
sleep 1
devclean scan

sleep 3

echo ""
echo "$ devclean clean --dry-run"
sleep 1
devclean clean --dry-run

sleep 3

echo ""
echo "$ devclean stats"
sleep 1
devclean stats

echo ""
echo "✅ Demo Complete!"
