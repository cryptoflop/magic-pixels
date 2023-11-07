// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace MagicPixelsTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Account = {
  id: Scalars['ID'];
  last_block: Scalars['BigInt'];
  balances: Array<PixelBalance>;
};


export type AccountbalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PixelBalance_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PixelBalance_filter>;
};

export type Account_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  last_block?: InputMaybe<Scalars['BigInt']>;
  last_block_not?: InputMaybe<Scalars['BigInt']>;
  last_block_gt?: InputMaybe<Scalars['BigInt']>;
  last_block_lt?: InputMaybe<Scalars['BigInt']>;
  last_block_gte?: InputMaybe<Scalars['BigInt']>;
  last_block_lte?: InputMaybe<Scalars['BigInt']>;
  last_block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  last_block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balances?: InputMaybe<Array<Scalars['String']>>;
  balances_not?: InputMaybe<Array<Scalars['String']>>;
  balances_contains?: InputMaybe<Array<Scalars['String']>>;
  balances_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  balances_not_contains?: InputMaybe<Array<Scalars['String']>>;
  balances_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  balances_?: InputMaybe<PixelBalance_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Account_filter>>>;
};

export type Account_orderBy =
  | 'id'
  | 'last_block'
  | 'balances';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Conjured = {
  id: Scalars['Bytes'];
  conjurer: Scalars['Bytes'];
  pixels: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type Conjured_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  conjurer?: InputMaybe<Scalars['Bytes']>;
  conjurer_not?: InputMaybe<Scalars['Bytes']>;
  conjurer_gt?: InputMaybe<Scalars['Bytes']>;
  conjurer_lt?: InputMaybe<Scalars['Bytes']>;
  conjurer_gte?: InputMaybe<Scalars['Bytes']>;
  conjurer_lte?: InputMaybe<Scalars['Bytes']>;
  conjurer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  conjurer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  conjurer_contains?: InputMaybe<Scalars['Bytes']>;
  conjurer_not_contains?: InputMaybe<Scalars['Bytes']>;
  pixels?: InputMaybe<Scalars['Bytes']>;
  pixels_not?: InputMaybe<Scalars['Bytes']>;
  pixels_gt?: InputMaybe<Scalars['Bytes']>;
  pixels_lt?: InputMaybe<Scalars['Bytes']>;
  pixels_gte?: InputMaybe<Scalars['Bytes']>;
  pixels_lte?: InputMaybe<Scalars['Bytes']>;
  pixels_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_contains?: InputMaybe<Scalars['Bytes']>;
  pixels_not_contains?: InputMaybe<Scalars['Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Conjured_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Conjured_filter>>>;
};

export type Conjured_orderBy =
  | 'id'
  | 'conjurer'
  | 'pixels'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type Minted = {
  id: Scalars['Bytes'];
  minter: Scalars['Bytes'];
  pixels: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type Minted_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  minter?: InputMaybe<Scalars['Bytes']>;
  minter_not?: InputMaybe<Scalars['Bytes']>;
  minter_gt?: InputMaybe<Scalars['Bytes']>;
  minter_lt?: InputMaybe<Scalars['Bytes']>;
  minter_gte?: InputMaybe<Scalars['Bytes']>;
  minter_lte?: InputMaybe<Scalars['Bytes']>;
  minter_in?: InputMaybe<Array<Scalars['Bytes']>>;
  minter_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  minter_contains?: InputMaybe<Scalars['Bytes']>;
  minter_not_contains?: InputMaybe<Scalars['Bytes']>;
  pixels?: InputMaybe<Scalars['Bytes']>;
  pixels_not?: InputMaybe<Scalars['Bytes']>;
  pixels_gt?: InputMaybe<Scalars['Bytes']>;
  pixels_lt?: InputMaybe<Scalars['Bytes']>;
  pixels_gte?: InputMaybe<Scalars['Bytes']>;
  pixels_lte?: InputMaybe<Scalars['Bytes']>;
  pixels_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_contains?: InputMaybe<Scalars['Bytes']>;
  pixels_not_contains?: InputMaybe<Scalars['Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Minted_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Minted_filter>>>;
};

export type Minted_orderBy =
  | 'id'
  | 'minter'
  | 'pixels'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type PixelBalance = {
  id: Scalars['ID'];
  pixel: Scalars['Bytes'];
  amount: Scalars['BigInt'];
};

export type PixelBalance_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pixel?: InputMaybe<Scalars['Bytes']>;
  pixel_not?: InputMaybe<Scalars['Bytes']>;
  pixel_gt?: InputMaybe<Scalars['Bytes']>;
  pixel_lt?: InputMaybe<Scalars['Bytes']>;
  pixel_gte?: InputMaybe<Scalars['Bytes']>;
  pixel_lte?: InputMaybe<Scalars['Bytes']>;
  pixel_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pixel_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pixel_contains?: InputMaybe<Scalars['Bytes']>;
  pixel_not_contains?: InputMaybe<Scalars['Bytes']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PixelBalance_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PixelBalance_filter>>>;
};

export type PixelBalance_orderBy =
  | 'id'
  | 'pixel'
  | 'amount';

export type Query = {
  conjured?: Maybe<Conjured>;
  conjureds: Array<Conjured>;
  minted?: Maybe<Minted>;
  minteds: Array<Minted>;
  pixelBalance?: Maybe<PixelBalance>;
  pixelBalances: Array<PixelBalance>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  tradeClosed?: Maybe<TradeClosed>;
  tradeCloseds: Array<TradeClosed>;
  tradeOpened?: Maybe<TradeOpened>;
  tradeOpeneds: Array<TradeOpened>;
  tradesByCreator?: Maybe<TradesByCreator>;
  tradesByCreators: Array<TradesByCreator>;
  tradesByReceiver?: Maybe<TradesByReceiver>;
  tradesByReceivers: Array<TradesByReceiver>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryconjuredArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryconjuredsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Conjured_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Conjured_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymintedArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymintedsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Minted_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Minted_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypixelBalanceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypixelBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PixelBalance_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PixelBalance_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradeClosedArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradeClosedsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradeClosed_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradeClosed_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradeOpenedArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradeOpenedsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradeOpened_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradeOpened_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradesByCreatorArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradesByCreatorsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradesByCreator_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradesByCreator_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradesByReceiverArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradesByReceiversArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradesByReceiver_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradesByReceiver_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transfer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  conjured?: Maybe<Conjured>;
  conjureds: Array<Conjured>;
  minted?: Maybe<Minted>;
  minteds: Array<Minted>;
  pixelBalance?: Maybe<PixelBalance>;
  pixelBalances: Array<PixelBalance>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  tradeClosed?: Maybe<TradeClosed>;
  tradeCloseds: Array<TradeClosed>;
  tradeOpened?: Maybe<TradeOpened>;
  tradeOpeneds: Array<TradeOpened>;
  tradesByCreator?: Maybe<TradesByCreator>;
  tradesByCreators: Array<TradesByCreator>;
  tradesByReceiver?: Maybe<TradesByReceiver>;
  tradesByReceivers: Array<TradesByReceiver>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionconjuredArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionconjuredsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Conjured_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Conjured_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmintedArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmintedsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Minted_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Minted_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpixelBalanceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpixelBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PixelBalance_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PixelBalance_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradeClosedArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradeClosedsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradeClosed_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradeClosed_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradeOpenedArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradeOpenedsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradeOpened_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradeOpened_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradesByCreatorArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradesByCreatorsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradesByCreator_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradesByCreator_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradesByReceiverArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradesByReceiversArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TradesByReceiver_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TradesByReceiver_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transfer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type TradeClosed = {
  id: Scalars['Bytes'];
  AuctionHouse_id: Scalars['Bytes'];
  seller: Scalars['Bytes'];
  buyer: Scalars['Bytes'];
  pixels: Array<Scalars['Bytes']>;
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type TradeClosed_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_not?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_gt?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_lt?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_gte?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_lte?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  AuctionHouse_id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  AuctionHouse_id_contains?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_not_contains?: InputMaybe<Scalars['Bytes']>;
  seller?: InputMaybe<Scalars['Bytes']>;
  seller_not?: InputMaybe<Scalars['Bytes']>;
  seller_gt?: InputMaybe<Scalars['Bytes']>;
  seller_lt?: InputMaybe<Scalars['Bytes']>;
  seller_gte?: InputMaybe<Scalars['Bytes']>;
  seller_lte?: InputMaybe<Scalars['Bytes']>;
  seller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  seller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  seller_contains?: InputMaybe<Scalars['Bytes']>;
  seller_not_contains?: InputMaybe<Scalars['Bytes']>;
  buyer?: InputMaybe<Scalars['Bytes']>;
  buyer_not?: InputMaybe<Scalars['Bytes']>;
  buyer_gt?: InputMaybe<Scalars['Bytes']>;
  buyer_lt?: InputMaybe<Scalars['Bytes']>;
  buyer_gte?: InputMaybe<Scalars['Bytes']>;
  buyer_lte?: InputMaybe<Scalars['Bytes']>;
  buyer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  buyer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  buyer_contains?: InputMaybe<Scalars['Bytes']>;
  buyer_not_contains?: InputMaybe<Scalars['Bytes']>;
  pixels?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_not?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  pixels_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TradeClosed_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TradeClosed_filter>>>;
};

export type TradeClosed_orderBy =
  | 'id'
  | 'AuctionHouse_id'
  | 'seller'
  | 'buyer'
  | 'pixels'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type TradeOpened = {
  id: Scalars['Bytes'];
  creator: Scalars['Bytes'];
  AuctionHouse_id: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type TradeOpened_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  creator?: InputMaybe<Scalars['Bytes']>;
  creator_not?: InputMaybe<Scalars['Bytes']>;
  creator_gt?: InputMaybe<Scalars['Bytes']>;
  creator_lt?: InputMaybe<Scalars['Bytes']>;
  creator_gte?: InputMaybe<Scalars['Bytes']>;
  creator_lte?: InputMaybe<Scalars['Bytes']>;
  creator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  creator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  creator_contains?: InputMaybe<Scalars['Bytes']>;
  creator_not_contains?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_not?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_gt?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_lt?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_gte?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_lte?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  AuctionHouse_id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  AuctionHouse_id_contains?: InputMaybe<Scalars['Bytes']>;
  AuctionHouse_id_not_contains?: InputMaybe<Scalars['Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TradeOpened_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TradeOpened_filter>>>;
};

export type TradeOpened_orderBy =
  | 'id'
  | 'creator'
  | 'AuctionHouse_id'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type TradesByCreator = {
  id: Scalars['ID'];
  trades: Array<Scalars['Bytes']>;
};

export type TradesByCreator_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  trades?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_not?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TradesByCreator_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TradesByCreator_filter>>>;
};

export type TradesByCreator_orderBy =
  | 'id'
  | 'trades';

export type TradesByReceiver = {
  id: Scalars['ID'];
  trades: Array<Scalars['Bytes']>;
};

export type TradesByReceiver_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  trades?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_not?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  trades_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TradesByReceiver_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TradesByReceiver_filter>>>;
};

export type TradesByReceiver_orderBy =
  | 'id'
  | 'trades';

export type Transfer = {
  id: Scalars['Bytes'];
  from: Scalars['Bytes'];
  to: Scalars['Bytes'];
  tokenId: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type Transfer_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_gt?: InputMaybe<Scalars['Bytes']>;
  from_lt?: InputMaybe<Scalars['Bytes']>;
  from_gte?: InputMaybe<Scalars['Bytes']>;
  from_lte?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenId?: InputMaybe<Scalars['BigInt']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transfer_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Transfer_filter>>>;
};

export type Transfer_orderBy =
  | 'id'
  | 'from'
  | 'to'
  | 'tokenId'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  conjured: InContextSdkMethod<Query['conjured'], QueryconjuredArgs, MeshContext>,
  /** null **/
  conjureds: InContextSdkMethod<Query['conjureds'], QueryconjuredsArgs, MeshContext>,
  /** null **/
  minted: InContextSdkMethod<Query['minted'], QuerymintedArgs, MeshContext>,
  /** null **/
  minteds: InContextSdkMethod<Query['minteds'], QuerymintedsArgs, MeshContext>,
  /** null **/
  pixelBalance: InContextSdkMethod<Query['pixelBalance'], QuerypixelBalanceArgs, MeshContext>,
  /** null **/
  pixelBalances: InContextSdkMethod<Query['pixelBalances'], QuerypixelBalancesArgs, MeshContext>,
  /** null **/
  account: InContextSdkMethod<Query['account'], QueryaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Query['accounts'], QueryaccountsArgs, MeshContext>,
  /** null **/
  tradeClosed: InContextSdkMethod<Query['tradeClosed'], QuerytradeClosedArgs, MeshContext>,
  /** null **/
  tradeCloseds: InContextSdkMethod<Query['tradeCloseds'], QuerytradeClosedsArgs, MeshContext>,
  /** null **/
  tradeOpened: InContextSdkMethod<Query['tradeOpened'], QuerytradeOpenedArgs, MeshContext>,
  /** null **/
  tradeOpeneds: InContextSdkMethod<Query['tradeOpeneds'], QuerytradeOpenedsArgs, MeshContext>,
  /** null **/
  tradesByCreator: InContextSdkMethod<Query['tradesByCreator'], QuerytradesByCreatorArgs, MeshContext>,
  /** null **/
  tradesByCreators: InContextSdkMethod<Query['tradesByCreators'], QuerytradesByCreatorsArgs, MeshContext>,
  /** null **/
  tradesByReceiver: InContextSdkMethod<Query['tradesByReceiver'], QuerytradesByReceiverArgs, MeshContext>,
  /** null **/
  tradesByReceivers: InContextSdkMethod<Query['tradesByReceivers'], QuerytradesByReceiversArgs, MeshContext>,
  /** null **/
  transfer: InContextSdkMethod<Query['transfer'], QuerytransferArgs, MeshContext>,
  /** null **/
  transfers: InContextSdkMethod<Query['transfers'], QuerytransfersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  conjured: InContextSdkMethod<Subscription['conjured'], SubscriptionconjuredArgs, MeshContext>,
  /** null **/
  conjureds: InContextSdkMethod<Subscription['conjureds'], SubscriptionconjuredsArgs, MeshContext>,
  /** null **/
  minted: InContextSdkMethod<Subscription['minted'], SubscriptionmintedArgs, MeshContext>,
  /** null **/
  minteds: InContextSdkMethod<Subscription['minteds'], SubscriptionmintedsArgs, MeshContext>,
  /** null **/
  pixelBalance: InContextSdkMethod<Subscription['pixelBalance'], SubscriptionpixelBalanceArgs, MeshContext>,
  /** null **/
  pixelBalances: InContextSdkMethod<Subscription['pixelBalances'], SubscriptionpixelBalancesArgs, MeshContext>,
  /** null **/
  account: InContextSdkMethod<Subscription['account'], SubscriptionaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Subscription['accounts'], SubscriptionaccountsArgs, MeshContext>,
  /** null **/
  tradeClosed: InContextSdkMethod<Subscription['tradeClosed'], SubscriptiontradeClosedArgs, MeshContext>,
  /** null **/
  tradeCloseds: InContextSdkMethod<Subscription['tradeCloseds'], SubscriptiontradeClosedsArgs, MeshContext>,
  /** null **/
  tradeOpened: InContextSdkMethod<Subscription['tradeOpened'], SubscriptiontradeOpenedArgs, MeshContext>,
  /** null **/
  tradeOpeneds: InContextSdkMethod<Subscription['tradeOpeneds'], SubscriptiontradeOpenedsArgs, MeshContext>,
  /** null **/
  tradesByCreator: InContextSdkMethod<Subscription['tradesByCreator'], SubscriptiontradesByCreatorArgs, MeshContext>,
  /** null **/
  tradesByCreators: InContextSdkMethod<Subscription['tradesByCreators'], SubscriptiontradesByCreatorsArgs, MeshContext>,
  /** null **/
  tradesByReceiver: InContextSdkMethod<Subscription['tradesByReceiver'], SubscriptiontradesByReceiverArgs, MeshContext>,
  /** null **/
  tradesByReceivers: InContextSdkMethod<Subscription['tradesByReceivers'], SubscriptiontradesByReceiversArgs, MeshContext>,
  /** null **/
  transfer: InContextSdkMethod<Subscription['transfer'], SubscriptiontransferArgs, MeshContext>,
  /** null **/
  transfers: InContextSdkMethod<Subscription['transfers'], SubscriptiontransfersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["magic-pixels"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
