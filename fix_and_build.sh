#!/bin/bash
set -ex

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Download standalone gradle if needed
if [ ! -d "/opt/gradle" ]; then
  mkdir -p /opt/gradle
  cd /opt/gradle
  wget -q https://services.gradle.org/distributions/gradle-8.11.1-bin.zip
  unzip -q gradle-8.11.1-bin.zip
  rm -f gradle-8.11.1-bin.zip
fi

export PATH=/opt/gradle/gradle-8.11.1/bin:$PATH

cd /app/applet/android
echo "sdk.dir=/opt/android-sdk" > local.properties

# Run assembleDebug directly with gradle
gradle assembleDebug --no-daemon

cd /app/applet

# Verify and copy APK
mkdir -p .build-outputs
mkdir -p APK_DOWNLOAD

cp android/app/build/outputs/apk/debug/app-debug.apk .build-outputs/app-debug.apk
cp android/app/build/outputs/apk/debug/app-debug.apk APK_DOWNLOAD/app-debug.apk

echo "=== Output check ==="
ls -lh .build-outputs/app-debug.apk
ls -lh APK_DOWNLOAD/app-debug.apk
file APK_DOWNLOAD/app-debug.apk
unzip -t APK_DOWNLOAD/app-debug.apk | head -n 30
echo "=== SUCCESS ==="
