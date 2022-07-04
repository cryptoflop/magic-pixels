import { Component } from 'solid-js';

import useAddress from '../signals/useAccount';
import Button from './Button';

const Wallet: Component = () => {
  const [address, request] = useAddress();

  return <Button class='max-w-[7rem] truncate px-1.5 py-0' title={address()} onClick={request}>{address()}</Button>;
};

export default Wallet;