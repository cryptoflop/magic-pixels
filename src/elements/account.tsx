import React, { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';

function Account({}) {
  const provider = useRef<ethers.providers.Web3Provider>();
  const [address, setAddress] = useState<string>();

  const connect = async () => {
    if (provider.current || !window.ethereum) {
      return;
    }

    if (!window.ethereum.selectedAddress) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    if (window.ethereum.selectedAddress) {
      setAddress(window.ethereum.selectedAddress);
    }

    const p = new ethers.providers.Web3Provider(window.ethereum);
    provider.current = p;

    const signer = p.getSigner();
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        if (!window.ethereum.selectedAddress) {
          setAddress(undefined);
          provider.current = undefined;
        }
      });
    }
    connect();
  }, []);

  return (
    <div
      className={'bg-pink-500 pl-2 pr-1 text-white w-20 flex items-center ' + (address ? '' : 'cursor-pointer')}
      onClick={connect}
    >
      <div className="text-center w-20 overflow-hidden text-ellipsis pointer-events-none">{address || 'Connect'}</div>
    </div>
  );
}

export default Account;
