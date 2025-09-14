# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# CRITICAL: AdMob ProGuard rules (prevents crashes in release builds)
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.**

# CRITICAL: RevenueCat ProGuard rules (prevents crashes in release builds)
-keep class com.revenuecat.purchases.** { *; }
-keep class com.revenuecat.purchases.interfaces.** { *; }
-dontwarn com.revenuecat.purchases.**

# Capacitor plugins (prevents crashes for local notifications)
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.plugins.** { *; }
-dontwarn com.getcapacitor.**
-dontwarn com.capacitorjs.plugins.**

# Keep JavaScript interface for WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Standard Android rules
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
