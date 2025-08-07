import { Identity } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';

// Test Case
export const host =
  process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
    ? 'https://icp0.io'
    : 'http://127.0.0.1:4943';

export const provider =
  process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

export const ICP_BLINK_PREFIX = /^(icp-action:|icp:)/;
export const STRIKE_ACTION_REGEX = /^https:\/\/.+\/actions\.json$/;

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

// odnze-xmfpy-e3qkb-756k4-7au3s-cd5vx-tx4od-hcazq-pl65r-7rsvs-qae
// wf3fv-4c4nr-7ks2b-xa4u7-kf3no-32glf-lf7e4-4ng4a-wwtlu-a2vnq-nae
const admin = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(1));

// 52mr2-fw2ng-2ofst-7jekz-xbymo-3ysz7-itwdk-bgstz-r7g4g-oz5vi-pqe
const ali = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(2));

// skpwg-42fe4-eyep5-nfyz7-66wvg-hthea-q3eek-vonbv-5wpxs-nxhmh-fqe
const bob = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(3));

// ghaya-cncjm-ntxgt-af5pp-6hzsz-tvwlv-hrlfc-ocq3t-ai7vk-vyixr-cqe
const charlie = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(4));

export const testAccounts = [
  { name: 'admin', identity: admin },
  { name: 'ali', identity: ali },
  { name: 'bob', identity: bob },
  { name: 'charlie', identity: charlie },
] as const;

export type TestAccountKeys = (typeof testAccounts)[number]['name'];

export const isTestIdentity = (identity: Identity) => {
  return testAccounts.some(
    (account) =>
      account.identity.getPrincipal().compareTo(identity.getPrincipal()) ===
      'eq',
  );
};
