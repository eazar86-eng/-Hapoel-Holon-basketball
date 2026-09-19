import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aviholon.teamapp',
  appName: 'אבי חולון',
  webDir: 'dist',
  server: {
    iosScheme: 'capacitor'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#35185f',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK'
    }
  }
};

export default config;
