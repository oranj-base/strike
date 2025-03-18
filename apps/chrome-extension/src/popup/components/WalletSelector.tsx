import { ReactNode } from 'react';
import InternetIdentityLogo from '../assets/InternetIdentityLogo';
import XverseWalletLogo from '../assets/XverseWalletLogo';
import PlugLogo from '../assets/PlugLogo';
import ArrowFromSquareIcon from '../icons/ArrowFromSquareIcon';
import { Checkbox } from './Checkbox';

enum Wallets {
  Plug = 'plug',
  InternetIdentity = 'ii',
  Xverse = 'XverseProviders.BitcoinProvider'
}

interface WalletProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
}
const WalletSelect = ({
  title,
  subtitle,
  icon,
  isSelected,
  isDisabled,
  onChange,
}: WalletProps & {
  isSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (nextVal: boolean) => void;
}) => {
  const borderColor = isSelected
    ? 'border-accent-brand'
    : 'border-secondary hover:border-[#C4C6C8]';
  const onClick = () => {
    onChange?.(!isSelected);
  };
  return (
    <label
      className={`cursor-pointer items-center w-full ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
      onClick={onClick}
    >
      <input type="hidden" checked={isSelected} onChange={onClick} />
      <div
        className={
          'border px-4 py-3 flex flex-row items-center gap-3 rounded-lg group ' +
          borderColor
        }
      >
        {icon}
        <div className="flex flex-col flex-1">
          <span className="text-text font-medium">{title}</span>
          {subtitle && (
            <span className="text-caption font-medium text-quaternary">
              {subtitle}
            </span>
          )}
        </div>
        {isDisabled ? (
          <span className="text-[red] text-[14px]">Coming soon</span>
        ) : (
          <Checkbox checked={isSelected} />
        )}
      </div>
    </label>
  );
};

const WalletLink = ({
  title,
  subtitle,
  icon,
  url,
}: WalletProps & {
  url: string;
}) => (
  <button
    className={
      'border px-4 py-3 flex flex-row items-center gap-3 rounded-lg hover:border-[#C4C6C8]'
    }
    onClick={() =>
      chrome.tabs.create({
        url,
      })
    }
  >
    {icon}
    <div className="flex flex-col flex-1 items-start">
      <span className="text-text font-medium">{title}</span>
      {subtitle && (
        <span className="text-caption font-medium text-quaternary">
          {subtitle}
        </span>
      )}
    </div>
    <ArrowFromSquareIcon className="text-icon-secondary" />
  </button>
);

export const WalletSelector = ({
  selectedWallet,
  setSelectedWallet,
}: {
  selectedWallet?: string | null;
  setSelectedWallet: (w: string | null) => void;
}) => {
  function selectWallet(wallet: string) {
    setSelectedWallet(wallet);
    chrome.storage.local.set({ strikeProvider: wallet });
  }

  function unselectWallet() {
    setSelectedWallet(null);
    chrome.storage.local.remove('strikeProvider');
  }

  const isInternetIdentity = selectedWallet === Wallets.InternetIdentity;
  const isPlug = selectedWallet === Wallets.Plug;
  const isXverse = selectedWallet === Wallets.Xverse

  return (
    <div className="flex flex-col flex-1 gap-2 w-full">
      <WalletSelect
        isSelected={isInternetIdentity}
        title="Internet Identity"
        icon={<InternetIdentityLogo />}
        onChange={(isChecked: boolean) =>
          isChecked ? selectWallet(Wallets.InternetIdentity) : unselectWallet() 
        }
      />
      <WalletSelect
        isSelected={isXverse}
        title="Xverse"
        icon={<XverseWalletLogo />}
        onChange={(isChecked: boolean) =>
          isChecked ? selectWallet(Wallets.Xverse) : unselectWallet()
        }
      />
      <WalletSelect
        isSelected={isPlug}
        isDisabled={true}
        title="Plug"
        icon={<PlugLogo />}
        onChange={(isChecked: boolean) =>
          isChecked ? selectWallet(Wallets.Plug) : unselectWallet()
        }
      />
    </div>
  );
};
