# Simple Redux Introduction - Setup Script (PowerShell)
Write-Host "🎮 Setting up Simple Redux Introduction - Pokémon App" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow

# Check if Node.js is installed
$nodeVersion = $null
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ and try again." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
$npmVersion = $null
try {
    $npmVersion = npm --version 2>$null
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm and try again." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Check if installation was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run 'npm start' to start the development server"
    Write-Host "  2. Open http://localhost:3000 in your browser"
    Write-Host "  3. Explore the different Redux workflows:"
    Write-Host "     - 🔍 Search: Individual Pokémon fetch"
    Write-Host "     - 📋 List: Paginated data loading"
    Write-Host "     - ❤️ Favorites: Local state management"
    Write-Host "     - ⚔️ Battle: Complex state dependencies"
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    Write-Host "  - README.md - Project overview and setup"
    Write-Host "  - WORKFLOW_DOCUMENTATION.md - Detailed Redux patterns"
    Write-Host ""
    Write-Host "Happy learning! 🎓" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Setup failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
