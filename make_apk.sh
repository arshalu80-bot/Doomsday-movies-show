#!/bin/bash
set -ex

export DEBIAN_FRONTEND=noninteractive

echo "=== Step 1: Installing OpenJDK 21, wget, unzip ==="
apt-get update -y
apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" --no-install-recommends openjdk-21-jdk-headless wget unzip file

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

echo "=== Step 2: Setting up Android SDK ==="
export ANDROID_HOME=/opt/android-sdk
mkdir -p $ANDROID_HOME/cmdline-tools
cd $ANDROID_HOME/cmdline-tools

if [ ! -d "latest" ]; then
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip
  unzip -q cmdline-tools.zip
  mv cmdline-tools latest
  rm -f cmdline-tools.zip
fi

export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

echo "=== Step 3: Accepting licenses and installing SDK packages ==="
yes | sdkmanager --licenses > /dev/null 2>&1 || true
sdkmanager "platform-tools" "platforms;android-34" "platforms;android-35" "build-tools;34.0.0" "build-tools;35.0.0"

cd /app/applet

echo "=== Step 4: Building Web Assets & Syncing Capacitor ==="
npm run build
npx cap sync android

echo "sdk.dir=/opt/android-sdk" > android/local.properties

echo "=== Step 5: Building APK with Gradle ==="
cd android
chmod +x gradlew
./gradlew assembleDebug --no-daemon

cd /app/applet

echo "=== Step 6: Verifying and copying APK ==="
APK_SOURCE="android/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$APK_SOURCE" ]; then
  echo "Error: APK not found at $APK_SOURCE"
  exit 1
fi

mkdir -p .build-outputs
mkdir -p APK_DOWNLOAD

cp "$APK_SOURCE" .build-outputs/app-debug.apk
cp "$APK_SOURCE" APK_DOWNLOAD/app-debug.apk

echo "=== Step 7: Final verification ==="
ls -lh .build-outputs/app-debug.apk
ls -lh APK_DOWNLOAD/app-debug.apk
file APK_DOWNLOAD/app-debug.apk
unzip -t APK_DOWNLOAD/app-debug.apk | head -n 30

echo "=== APK GENERATION COMPLETE ==="
