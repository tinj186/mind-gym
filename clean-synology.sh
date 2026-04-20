#!/bin/bash
echo "🧹 Scrubbing Synology metadata..."
find . -name "@eaDir" -type d -exec rm -rf {} +

echo "🗑️ Removing build artifacts and lockfiles..."
rm -rf .next/ node_modules/ package-lock.json

echo "🔑 Resetting file ownership to user 1026..."
# This ensures any files created by Docker as root are returned to your user
sudo chown -R 1026:1026 .

echo "✅ Project directory is clean, owned by 1026, and ready for a fresh start."