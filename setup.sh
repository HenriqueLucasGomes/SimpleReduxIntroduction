#!/bin/bash

# Simple Redux Introduction - Setup Script
echo "🎮 Setting up Simple Redux Introduction - Pokémon App"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Run 'npm start' to start the development server"
    echo "  2. Open http://localhost:3000 in your browser"
    echo "  3. Explore the different Redux workflows:"
    echo "     - 🔍 Search: Individual Pokémon fetch"
    echo "     - 📋 List: Paginated data loading"
    echo "     - ❤️ Favorites: Local state management"
    echo "     - ⚔️ Battle: Complex state dependencies"
    echo ""
    echo "📚 Documentation:"
    echo "  - README.md - Project overview and setup"
    echo "  - WORKFLOW_DOCUMENTATION.md - Detailed Redux patterns"
    echo ""
    echo "Happy learning! 🎓"
else
    echo ""
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
fi
