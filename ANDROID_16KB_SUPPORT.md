# Android 16 KB Page Size Support

This document describes the changes made to support 16 KB memory page sizes required for Android 15+ compatibility.

## Background

Google Play requires all apps targeting Android 15+ (SDK 35+) to support 16 KB memory page sizes. This ensures compatibility with devices that use 16 KB memory pages instead of the traditional 4 KB pages for improved performance.

## Changes Made

### 1. Gradle Properties (`android/gradle.properties`)
- Added `android.enablePageSizeSupport=true` to enable 16 KB page size support
- Increased JVM heap size from 1536m to 2048m for better memory handling
- Added `android.enableR8.fullMode=true` for additional optimizations

### 2. App Build Configuration (`android/app/build.gradle`)
- Added NDK configuration with explicit ABI filters to ensure proper native library alignment
- Added packaging options to disable legacy packaging for proper 16 KB alignment
- Enhanced debug build type configuration

### 3. Build Tools
- Confirmed Android Gradle Plugin 8.9.1 is used (supports 16 KB page sizes)

## Verification

To verify that the app supports 16 KB page sizes:

1. **Build the app:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Test on 16 KB devices:**
   - Use Android emulator with 16 KB page size configuration
   - Test on physical devices with 16 KB page sizes
   - Use Google Play Console's app bundle explorer to verify 16 KB support

3. **Check build output:**
   - Ensure no errors related to memory alignment
   - Verify all native libraries are properly packaged

## Google Play Console Verification

After building and uploading the app bundle to Google Play Console:
1. Go to Release management > App bundle explorer
2. Select the latest app bundle
3. Check if "16 KB page size support" is listed as supported

## Testing Recommendations

- Test the app on devices/emulators with 16 KB page sizes
- Verify all camera functionality works correctly
- Test media capture and storage operations
- Ensure all Capacitor plugins function properly

## References

- [Supporting 16 KB devices](https://developer.android.com/guide/practices/page-sizes#build)
- [Prepare your Play app for 16 KB page sizes](https://www.youtube.com/watch?v=MnMGJhuChRI)
- [Technical requirement announcement](https://android-developers.googleblog.com/2025/05/prepare-play-apps-for-devices-with-16kb-page-size.html)