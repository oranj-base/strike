import { useEffect, useState } from 'react';
import Header from './components/Header';
import ToggleSwitch from './components/ToggleSwitch';
import Footer from './components/Footer';

function Popup() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

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

export default Popup;
