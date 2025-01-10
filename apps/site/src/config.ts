// Test Case
export const host =
  process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
    ? 'https://icp0.io'
    : 'https://icp0.io';

export const provider =
  process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

export const ICP_BLINK_PREFIX = /^(icp-action:|icp:)/;

export interface Wallet {
  id: string;
  name: string;
  lightLogo: string;
  darkLogo: string;
  link: string;
}

export const btcWallets: Wallet[] = [
  {
    id: 'XverseProviders.BitcoinProvider',
    name: 'Xverse',
    lightLogo: '/wallet/xverse.svg',
    darkLogo: '/wallet/xverse.svg',
    link: 'https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg?hl=en',
  },
  {
    id: 'unisat',
    name: 'Unisat',
    lightLogo: '/wallet/unisat.png',
    darkLogo: '/wallet/unisat.png',
    link: 'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo?hl=en',
  },
  {
    id: 'wizz',
    name: 'Wizz',
    lightLogo: '/wallet/wizz-black.png',
    darkLogo: '/wallet/wizz-black.png',
    link: 'https://chromewebstore.google.com/detail/wizz-wallet/ghlmndacnhlaekppcllcpcjjjomjkjpg?hl=en',
  },
  {
    id: 'okxwallet.bitcoin',
    name: 'OKX',
    lightLogo: '/wallet/okx.png',
    darkLogo: '/wallet/okx.png',
    link: 'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge?hl=en',
  },
  {
    id: 'OrangecryptoProviders.BitcoinProvider',
    name: 'Orange',
    lightLogo: '/wallet/orange.png',
    darkLogo: '/wallet/orange.png',
    link: 'https://chromewebstore.google.com/detail/glmhbknppefdmpemdmjnjlinpbclokhn',
  },
];
