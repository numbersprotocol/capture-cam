#!/bin/bash

# Build verification script for 16 KB page size support
# This script helps verify that the Android build configuration supports 16 KB page sizes

echo "🔧 Verifying Android 16 KB page size support..."

# Check if we're in the right directory
if [ ! -f "android/build.gradle" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

echo "📋 Checking build configuration..."

# Check gradle.properties
if grep -q "android.enablePageSizeSupport=true" android/gradle.properties; then
    echo "✅ Page size support enabled in gradle.properties"
else
    echo "❌ Page size support not found in gradle.properties"
    exit 1
fi

# Check Android Gradle Plugin version
if grep -q "com.android.tools.build:gradle:8\.[7-9]" android/build.gradle; then
    echo "✅ Android Gradle Plugin version supports 16 KB page sizes"
else
    echo "⚠️  Warning: Android Gradle Plugin version may not support 16 KB page sizes"
fi

# Check NDK configuration
if grep -q "abiFilters.*arm64-v8a" android/app/build.gradle; then
    echo "✅ NDK configuration includes ARM64 support"
else
    echo "❌ NDK configuration missing or incomplete"
    exit 1
fi

# Check packaging options
if grep -q "useLegacyPackaging = false" android/app/build.gradle; then
    echo "✅ Modern packaging enabled for proper alignment"
else
    echo "❌ Legacy packaging configuration missing"
    exit 1
fi

echo ""
echo "🎉 All 16 KB page size support configurations are in place!"
echo ""
echo "Next steps:"
echo "1. Build the app: cd android && ./gradlew assembleRelease"
echo "2. Test on 16 KB page size devices/emulators"
echo "3. Upload to Google Play Console and verify 16 KB support in bundle explorer"
echo ""
echo "For more information, see ANDROID_16KB_SUPPORT.md"