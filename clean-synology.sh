#!/bin/bash
echo "🧹 Scrubbing Synology metadata..."
find . -name "@eaDir" -type d -exec rm -rf {} +
echo "✅ Project directory is clean of @eaDir."