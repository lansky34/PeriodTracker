# FlowTracker - Period Tracking Mobile App

## Overview

FlowTracker is a React-based mobile period tracking application built with Capacitor for cross-platform deployment. The app enables users to track menstrual cycles, log symptoms, view insights, and receive notifications. It features a freemium monetization model with ads for free users and a subscription-based Pro tier that removes ads and unlocks premium features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and responsive design
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation schemas

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Express sessions with bcrypt password hashing
- **API Design**: RESTful endpoints with JSON responses and proper error handling
- **Validation**: Shared Zod schemas between client and server for data consistency

### Mobile Platform Integration
- **Cross-Platform**: Capacitor framework for iOS and Android deployment
- **Native Plugins**: Local notifications, AdMob integration, and RevenueCat purchases
- **App Configuration**: Bundle ID `xyz.flowtracker.app` for both platforms
- **Build System**: Separate iOS Xcode workspace and Android Gradle project

### Data Model
- **Users**: Authentication and profile management
- **Cycles**: Period cycle tracking with start/end dates and metrics
- **Periods**: Individual period instances within cycles
- **Symptoms**: Comprehensive symptom logging with categories for flow, pain, mood, energy, physical symptoms, and lifestyle factors

### Monetization Architecture
- **Ad Integration**: Google AdMob with test IDs for initial submission, supporting banner, interstitial, and rewarded ad formats
- **Subscription Management**: RevenueCat SDK for cross-platform IAP handling with Pro entitlement gating
- **Feature Gating**: Pro users bypass ad initialization entirely; ads are conditionally rendered based on subscription status
- **Revenue Model**: Freemium with monthly ($4.99) and annual ($39.99) Pro subscriptions

### Notification System
- **Local Notifications**: Capacitor plugin for period reminders and symptom tracking prompts
- **Scheduling Logic**: Predictive notifications based on cycle history and user preferences
- **Permission Handling**: Runtime permission requests with graceful fallbacks for web platform

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via @neondatabase/serverless for cloud hosting
- **ORM**: Drizzle for type-safe database queries and migrations

### Mobile SDKs
- **AdMob**: @capacitor-community/admob v7.0.3 for advertisement display
- **RevenueCat**: @revenuecat/purchases-capacitor v11.2.1 for subscription management
- **Capacitor**: v7.4.3 core framework with iOS and Android platform support

### Development Tools
- **Build Tool**: Vite with React plugin and TypeScript support
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Validation**: Zod schemas for runtime type checking and form validation
- **Query Management**: TanStack Query for server state synchronization

### Platform Services
- **Google Play Console**: Android app distribution and testing
- **Apple App Store Connect**: iOS app distribution and TestFlight beta testing
- **AdMob Console**: Ad unit management and revenue analytics
- **RevenueCat Dashboard**: Subscription analytics and webhook management

### Environment Configuration
- Feature flags for ADS_ENABLED and IAP_ENABLED
- Platform-specific RevenueCat API keys
- AdMob test unit IDs for store submission (to be replaced with production IDs post-approval)
- Database connection strings and session secrets