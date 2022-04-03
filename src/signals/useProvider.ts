import { ethers } from 'ethers';

import type { MetaMaskInpageProvider } from '@metamask/providers';
import { createSignal } from 'solid-js';

const injected = (window as unknown as { ethereum: MetaMaskInpageProvider }).ethereum;

export default function() {
  const [provider, setProvider] = createSignal<ethers.providers.Web3Provider>();
  const p = new ethers.providers.Web3Provider(injected as unknown as ethers.providers.ExternalProvider);
  setProvider(p);
  return provider;
}