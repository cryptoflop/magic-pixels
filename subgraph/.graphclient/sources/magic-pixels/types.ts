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
  Int8: any;
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

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
  last_block: Scalars['BigInt'];
  balances: Scalars['String'];
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
  last_block?: InputMaybe<Scalars['BigInt']>;
  last_block_not?: InputMaybe<Scalars['BigInt']>;
  last_block_gt?: InputMaybe<Scalars['BigInt']>;
  last_block_lt?: InputMaybe<Scalars['BigInt']>;
  last_block_gte?: InputMaybe<Scalars['BigInt']>;
  last_block_lte?: InputMaybe<Scalars['BigInt']>;
  last_block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  last_block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balances?: InputMaybe<Scalars['String']>;
  balances_not?: InputMaybe<Scalars['String']>;
  balances_gt?: InputMaybe<Scalars['String']>;
  balances_lt?: InputMaybe<Scalars['String']>;
  balances_gte?: InputMaybe<Scalars['String']>;
  balances_lte?: InputMaybe<Scalars['String']>;
  balances_in?: InputMaybe<Array<Scalars['String']>>;
  balances_not_in?: InputMaybe<Array<Scalars['String']>>;
  balances_contains?: InputMaybe<Scalars['String']>;
  balances_contains_nocase?: InputMaybe<Scalars['String']>;
  balances_not_contains?: InputMaybe<Scalars['String']>;
  balances_not_contains_nocase?: InputMaybe<Scalars['String']>;
  balances_starts_with?: InputMaybe<Scalars['String']>;
  balances_starts_with_nocase?: InputMaybe<Scalars['String']>;
  balances_not_starts_with?: InputMaybe<Scalars['String']>;
  balances_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  balances_ends_with?: InputMaybe<Scalars['String']>;
  balances_ends_with_nocase?: InputMaybe<Scalars['String']>;
  balances_not_ends_with?: InputMaybe<Scalars['String']>;
  balances_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PixelBalance_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PixelBalance_filter>>>;
};

export type PixelBalance_orderBy =
  | 'id'
  | 'last_block'
  | 'balances';

export type Query = {
  pixelBalance?: Maybe<PixelBalance>;
  pixelBalances: Array<PixelBalance>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
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


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  pixelBalance?: Maybe<PixelBalance>;
  pixelBalances: Array<PixelBalance>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
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

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']>;
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
  trade: InContextSdkMethod<Query['trade'], QuerytradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Query['trades'], QuerytradesArgs, MeshContext>,
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
  trade: InContextSdkMethod<Subscription['trade'], SubscriptiontradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Subscription['trades'], SubscriptiontradesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["magic-pixels"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
