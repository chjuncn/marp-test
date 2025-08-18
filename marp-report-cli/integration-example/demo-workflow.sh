#!/bin/bash

echo "🚀 Marp Report CLI Integration Demo"
echo "====================================="
echo ""

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_DIR="$(dirname "$SCRIPT_DIR")"

echo "📦 Step 1: Building CLI (if needed)..."
cd "$CLI_DIR"
if [ ! -d "dist" ]; then
    echo "Building marp-report-cli..."
    npm run build
else
    echo "CLI already built ✅"
fi
echo ""

echo "📝 Step 2: Converting Markdown to JSON..."
npm run cli -- convert example.md --format json --output integration-example/src/data/example-report.json
echo ""

echo "🔧 Step 3: Building marp-report-react (if needed)..."
cd ../marp-report-react
if [ ! -d "dist" ]; then
    echo "Building marp-report-react..."
    npm run build
else
    echo "marp-report-react already built ✅"
fi
echo ""

echo "📦 Step 4: Installing React app dependencies..."
cd "$CLI_DIR/integration-example"
npm install
echo ""

echo "🎯 Step 5: Starting React development server..."
echo ""
echo "🌟 The React app will use the SAME components as your website!"
echo "🌟 This means IDENTICAL UI rendering!"
echo ""
echo "Opening http://localhost:3000 in 3 seconds..."
echo "Press Ctrl+C to stop the server"
echo ""
sleep 3

npm run dev
