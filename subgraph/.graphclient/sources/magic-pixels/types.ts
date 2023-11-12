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
  pixelBalance?: Maybe<PixelBalance>;
  pixelBalances: Array<PixelBalance>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  tradesByCreator?: Maybe<TradesByCreator>;
  tradesByCreators: Array<TradesByCreator>;
  tradesByReceiver?: Maybe<TradesByReceiver>;
  tradesByReceivers: Array<TradesByReceiver>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
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


export type QuerytradeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
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


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  pixelBalance?: Maybe<PixelBalance>;
  pixelBalances: Array<PixelBalance>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  tradesByCreator?: Maybe<TradesByCreator>;
  tradesByCreators: Array<TradesByCreator>;
  tradesByReceiver?: Maybe<TradesByReceiver>;
  tradesByReceivers: Array<TradesByReceiver>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
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


export type SubscriptiontradeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
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


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Trade = {
  id: Scalars['ID'];
  creator: Scalars['Bytes'];
  receiver: Scalars['Bytes'];
  pixels: Scalars['Bytes'];
  price: Scalars['BigInt'];
  tradeType: Scalars['Int'];
};

export type Trade_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
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
  receiver?: InputMaybe<Scalars['Bytes']>;
  receiver_not?: InputMaybe<Scalars['Bytes']>;
  receiver_gt?: InputMaybe<Scalars['Bytes']>;
  receiver_lt?: InputMaybe<Scalars['Bytes']>;
  receiver_gte?: InputMaybe<Scalars['Bytes']>;
  receiver_lte?: InputMaybe<Scalars['Bytes']>;
  receiver_in?: InputMaybe<Array<Scalars['Bytes']>>;
  receiver_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  receiver_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_not_contains?: InputMaybe<Scalars['Bytes']>;
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
  price?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradeType?: InputMaybe<Scalars['Int']>;
  tradeType_not?: InputMaybe<Scalars['Int']>;
  tradeType_gt?: InputMaybe<Scalars['Int']>;
  tradeType_lt?: InputMaybe<Scalars['Int']>;
  tradeType_gte?: InputMaybe<Scalars['Int']>;
  tradeType_lte?: InputMaybe<Scalars['Int']>;
  tradeType_in?: InputMaybe<Array<Scalars['Int']>>;
  tradeType_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Trade_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Trade_filter>>>;
};

export type Trade_orderBy =
  | 'id'
  | 'creator'
  | 'receiver'
  | 'pixels'
  | 'price'
  | 'tradeType';

export type TradesByCreator = {
  id: Scalars['ID'];
  trades: Array<Trade>;
};


export type TradesByCreatortradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
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
  trades?: InputMaybe<Array<Scalars['String']>>;
  trades_not?: InputMaybe<Array<Scalars['String']>>;
  trades_contains?: InputMaybe<Array<Scalars['String']>>;
  trades_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  trades_not_contains?: InputMaybe<Array<Scalars['String']>>;
  trades_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  trades_?: InputMaybe<Trade_filter>;
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
  trades: Array<Trade>;
};


export type TradesByReceivertradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
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
  trades?: InputMaybe<Array<Scalars['String']>>;
  trades_not?: InputMaybe<Array<Scalars['String']>>;
  trades_contains?: InputMaybe<Array<Scalars['String']>>;
  trades_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  trades_not_contains?: InputMaybe<Array<Scalars['String']>>;
  trades_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  trades_?: InputMaybe<Trade_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TradesByReceiver_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TradesByReceiver_filter>>>;
};

export type TradesByReceiver_orderBy =
  | 'id'
  | 'trades';

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
  pixelBalance: InContextSdkMethod<Query['pixelBalance'], QuerypixelBalanceArgs, MeshContext>,
  /** null **/
  pixelBalances: InContextSdkMethod<Query['pixelBalances'], QuerypixelBalancesArgs, MeshContext>,
  /** null **/
  account: InContextSdkMethod<Query['account'], QueryaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Query['accounts'], QueryaccountsArgs, MeshContext>,
  /** null **/
  trade: InContextSdkMethod<Query['trade'], QuerytradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Query['trades'], QuerytradesArgs, MeshContext>,
  /** null **/
  tradesByCreator: InContextSdkMethod<Query['tradesByCreator'], QuerytradesByCreatorArgs, MeshContext>,
  /** null **/
  tradesByCreators: InContextSdkMethod<Query['tradesByCreators'], QuerytradesByCreatorsArgs, MeshContext>,
  /** null **/
  tradesByReceiver: InContextSdkMethod<Query['tradesByReceiver'], QuerytradesByReceiverArgs, MeshContext>,
  /** null **/
  tradesByReceivers: InContextSdkMethod<Query['tradesByReceivers'], QuerytradesByReceiversArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  pixelBalance: InContextSdkMethod<Subscription['pixelBalance'], SubscriptionpixelBalanceArgs, MeshContext>,
  /** null **/
  pixelBalances: InContextSdkMethod<Subscription['pixelBalances'], SubscriptionpixelBalancesArgs, MeshContext>,
  /** null **/
  account: InContextSdkMethod<Subscription['account'], SubscriptionaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Subscription['accounts'], SubscriptionaccountsArgs, MeshContext>,
  /** null **/
  trade: InContextSdkMethod<Subscription['trade'], SubscriptiontradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Subscription['trades'], SubscriptiontradesArgs, MeshContext>,
  /** null **/
  tradesByCreator: InContextSdkMethod<Subscription['tradesByCreator'], SubscriptiontradesByCreatorArgs, MeshContext>,
  /** null **/
  tradesByCreators: InContextSdkMethod<Subscription['tradesByCreators'], SubscriptiontradesByCreatorsArgs, MeshContext>,
  /** null **/
  tradesByReceiver: InContextSdkMethod<Subscription['tradesByReceiver'], SubscriptiontradesByReceiverArgs, MeshContext>,
  /** null **/
  tradesByReceivers: InContextSdkMethod<Subscription['tradesByReceivers'], SubscriptiontradesByReceiversArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["magic-pixels"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
