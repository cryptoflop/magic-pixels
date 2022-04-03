import { createSignal } from 'solid-js';

import type { MetaMaskInpageProvider } from '@metamask/providers';

const injected = (window as unknown as { ethereum: MetaMaskInpageProvider }).ethereum;

export default function() {
  const [address, setAddress] = createSignal<string>('Not connected');

  const request = () => {
    injected.request({ method: 'eth_requestAccounts' }).then(() => {
      if (injected.selectedAddress) {
        setAddress(injected.selectedAddress);
      }
    });
  };

  if (injected) {
    injected.on('accountsChanged', () => {
      if (!injected.selectedAddress) {
        setAddress('Not connected');
      }
    });
  }

  if (!injected.selectedAddress) {
    request();
  }

  if (injected.selectedAddress) {
    setAddress(injected.selectedAddress);
  }

  return [address, request] as const;
}