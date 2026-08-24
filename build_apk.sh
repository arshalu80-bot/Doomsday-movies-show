#!/bin/bash
set -e

echo "=== 1. Building Web App ==="
npm run build

echo "=== 2. Configuring Capacitor ==="
if [ ! -f "capacitor.config.ts" ] && [ ! -f "capacitor.config.json" ]; then
  npx cap init "Avengers Doomsday Tracker" "com.avengers.doomsdaytracker" --web-dir "dist"
fi

if [ ! -d "android" ]; then
  npx cap add android
fi

npx cap sync android

echo "=== 3. Setting Android SDK Location ==="
echo "sdk.dir=/opt/android-sdk" > android/local.properties

echo "=== 4. Compiling Android Debug APK with Gradle ==="
cd android
export ANDROID_HOME=/opt/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
chmod +x gradlew
./gradlew assembleDebug --no-daemon

cd ..

echo "=== 5. Copying APK to requested locations ==="
mkdir -p .build-outputs
mkdir -p APK_DOWNLOAD

cp android/app/build/outputs/apk/debug/app-debug.apk .build-outputs/app-debug.apk
cp android/app/build/outputs/apk/debug/app-debug.apk APK_DOWNLOAD/app-debug.apk

echo "=== 6. Verifying APK Output ==="
ls -lh .build-outputs/app-debug.apk
ls -lh APK_DOWNLOAD/app-debug.apk
file APK_DOWNLOAD/app-debug.apk || true
unzip -l APK_DOWNLOAD/app-debug.apk | head -n 25

echo "=== BUILD SUCCESSFUL ==="
