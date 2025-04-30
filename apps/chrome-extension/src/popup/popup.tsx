import { useEffect, useState } from 'react';
import Header from './components/Header';
import ToggleSwitch from './components/ToggleSwitch';
import Footer from './components/Footer';
import {
  createClient,
  InternetIdentity,
  Plug,
  Nfid,
  defaultProviders,
} from '@oranjlabs/icp-wallet-adapter';

export const host =
  import.meta.env.VITE_DFX_NETWORK === 'ic'
    ? 'https://icp0.io'
    : 'http://127.0.0.1:4943';

export const provider =
  import.meta.env.VITE_DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

function Popup() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const client = createClient({
    providers: defaultProviders({
      host,
      providerUrl: provider,
      whitelist: [],
      autoConnect: true,
    }),
    globalProviderConfig: {
      host,
    },
  });

  // Load saved state on mount
  useEffect(() => {
    chrome.storage.local.get(['strke'], (result) => {
      console.log('Loaded state:', result.strke);
      setIsEnabled(result.strke === 'on');
    });
  }, []);

  // Update storage when toggle changes
  const handleToggleChange = (enabled: boolean) => {
    console.log('Toggle changed to:', enabled);
    setIsEnabled(enabled);

    const value = enabled ? 'on' : 'off';
    chrome.storage.local.set({ strke: value }, () => {
      console.log('Saved state:', value);
      if (!enabled) {
        client.disconnect();
      }

      // Reload current active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.reload(tabs[0].id);
          console.log('Reloading tab:', tabs[0].url);
        }
      });
    });
  };

  return (
    <div className="w-80 px-4 pt-10">
      <Header />
      <div className="py-4 border-y border-accent-brand">
        <ToggleSwitch
          isEnabled={isEnabled}
          onChange={handleToggleChange}
          label="Enable Strike"
        />
      </div>
      <Footer />
    </div>
  );
}

function createICPConnectors(config: any) {
  return [new InternetIdentity(config), new Plug(config), new Nfid(config)];
}

export default Popup;
