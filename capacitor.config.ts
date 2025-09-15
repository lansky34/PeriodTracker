import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.flowtracker.app',
  appName: 'FlowTracker',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      releaseType: 'AAB'
    }
  }
};

export default config;