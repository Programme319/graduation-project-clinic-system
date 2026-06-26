#!/bin/bash
echo "🔧 Running Vercel build script..."

# Clear caches
php artisan optimize:clear

# Don't run migrations here - we'll do it manually
# php artisan migrate --force

echo "✅ Build completed successfully!"