#!/bin/bash

echo "🧹 Cleaning up Next.js dev server..."

# Kill all next dev processes
echo "1. Killing Next.js processes..."
pkill -f "next dev" 2>/dev/null || echo "   No processes found"

# Kill processes on ports 3000 and 3001
echo "2. Freeing ports 3000 and 3001..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "   Port 3000 is free"
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "   Port 3001 is free"

# Remove lock files
echo "3. Removing lock files..."
if [ -d ".next" ]; then
  find .next -name "lock" -type f -delete 2>/dev/null
  find .next -name "*.lock" -type f -delete 2>/dev/null
  echo "   ✅ Lock files removed"
else
  echo "   No .next directory found"
fi

# Optional: Remove entire .next folder for clean rebuild
if [ "$1" = "--full" ]; then
  echo "4. Removing .next folder (full cleanup)..."
  rm -rf .next
  echo "   ✅ Full cleanup complete"
else
  echo "4. Skipping .next folder removal (use --full for complete cleanup)"
fi

echo ""
echo "✅ Cleanup complete! You can now run 'npm run dev'"
echo ""

