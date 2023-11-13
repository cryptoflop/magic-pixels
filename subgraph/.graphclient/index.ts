// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import AutoPaginationTransform from "@graphprotocol/client-auto-pagination";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { MagicPixelsTypes } from './sources/magic-pixels/types';
import * as importedModule$0 from "./sources/magic-pixels/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Account: ResolverTypeWrapper<Account>;
  Account_filter: Account_filter;
  Account_orderBy: Account_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  OrderDirection: OrderDirection;
  PixelBalance: ResolverTypeWrapper<PixelBalance>;
  PixelBalance_filter: PixelBalance_filter;
  PixelBalance_orderBy: PixelBalance_orderBy;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Trade: ResolverTypeWrapper<Trade>;
  Trade_filter: Trade_filter;
  Trade_orderBy: Trade_orderBy;
  TradesByCreator: ResolverTypeWrapper<TradesByCreator>;
  TradesByCreator_filter: TradesByCreator_filter;
  TradesByCreator_orderBy: TradesByCreator_orderBy;
  TradesByReceiver: ResolverTypeWrapper<TradesByReceiver>;
  TradesByReceiver_filter: TradesByReceiver_filter;
  TradesByReceiver_orderBy: TradesByReceiver_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: Account;
  Account_filter: Account_filter;
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  PixelBalance: PixelBalance;
  PixelBalance_filter: PixelBalance_filter;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  Trade: Trade;
  Trade_filter: Trade_filter;
  TradesByCreator: TradesByCreator;
  TradesByCreator_filter: TradesByCreator_filter;
  TradesByReceiver: TradesByReceiver;
  TradesByReceiver_filter: TradesByReceiver_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  last_block?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  balances?: Resolver<Array<ResolversTypes['PixelBalance']>, ParentType, ContextType, RequireFields<AccountbalancesArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type PixelBalanceResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PixelBalance'] = ResolversParentTypes['PixelBalance']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pixel?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  pixelBalance?: Resolver<Maybe<ResolversTypes['PixelBalance']>, ParentType, ContextType, RequireFields<QuerypixelBalanceArgs, 'id' | 'subgraphError'>>;
  pixelBalances?: Resolver<Array<ResolversTypes['PixelBalance']>, ParentType, ContextType, RequireFields<QuerypixelBalancesArgs, 'skip' | 'first' | 'subgraphError'>>;
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountArgs, 'id' | 'subgraphError'>>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  trade?: Resolver<Maybe<ResolversTypes['Trade']>, ParentType, ContextType, RequireFields<QuerytradeArgs, 'id' | 'subgraphError'>>;
  trades?: Resolver<Array<ResolversTypes['Trade']>, ParentType, ContextType, RequireFields<QuerytradesArgs, 'skip' | 'first' | 'subgraphError'>>;
  tradesByCreator?: Resolver<Maybe<ResolversTypes['TradesByCreator']>, ParentType, ContextType, RequireFields<QuerytradesByCreatorArgs, 'id' | 'subgraphError'>>;
  tradesByCreators?: Resolver<Array<ResolversTypes['TradesByCreator']>, ParentType, ContextType, RequireFields<QuerytradesByCreatorsArgs, 'skip' | 'first' | 'subgraphError'>>;
  tradesByReceiver?: Resolver<Maybe<ResolversTypes['TradesByReceiver']>, ParentType, ContextType, RequireFields<QuerytradesByReceiverArgs, 'id' | 'subgraphError'>>;
  tradesByReceivers?: Resolver<Array<ResolversTypes['TradesByReceiver']>, ParentType, ContextType, RequireFields<QuerytradesByReceiversArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  pixelBalance?: SubscriptionResolver<Maybe<ResolversTypes['PixelBalance']>, "pixelBalance", ParentType, ContextType, RequireFields<SubscriptionpixelBalanceArgs, 'id' | 'subgraphError'>>;
  pixelBalances?: SubscriptionResolver<Array<ResolversTypes['PixelBalance']>, "pixelBalances", ParentType, ContextType, RequireFields<SubscriptionpixelBalancesArgs, 'skip' | 'first' | 'subgraphError'>>;
  account?: SubscriptionResolver<Maybe<ResolversTypes['Account']>, "account", ParentType, ContextType, RequireFields<SubscriptionaccountArgs, 'id' | 'subgraphError'>>;
  accounts?: SubscriptionResolver<Array<ResolversTypes['Account']>, "accounts", ParentType, ContextType, RequireFields<SubscriptionaccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
  trade?: SubscriptionResolver<Maybe<ResolversTypes['Trade']>, "trade", ParentType, ContextType, RequireFields<SubscriptiontradeArgs, 'id' | 'subgraphError'>>;
  trades?: SubscriptionResolver<Array<ResolversTypes['Trade']>, "trades", ParentType, ContextType, RequireFields<SubscriptiontradesArgs, 'skip' | 'first' | 'subgraphError'>>;
  tradesByCreator?: SubscriptionResolver<Maybe<ResolversTypes['TradesByCreator']>, "tradesByCreator", ParentType, ContextType, RequireFields<SubscriptiontradesByCreatorArgs, 'id' | 'subgraphError'>>;
  tradesByCreators?: SubscriptionResolver<Array<ResolversTypes['TradesByCreator']>, "tradesByCreators", ParentType, ContextType, RequireFields<SubscriptiontradesByCreatorsArgs, 'skip' | 'first' | 'subgraphError'>>;
  tradesByReceiver?: SubscriptionResolver<Maybe<ResolversTypes['TradesByReceiver']>, "tradesByReceiver", ParentType, ContextType, RequireFields<SubscriptiontradesByReceiverArgs, 'id' | 'subgraphError'>>;
  tradesByReceivers?: SubscriptionResolver<Array<ResolversTypes['TradesByReceiver']>, "tradesByReceivers", ParentType, ContextType, RequireFields<SubscriptiontradesByReceiversArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type TradeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Trade'] = ResolversParentTypes['Trade']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  pixels?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tradeType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TradesByCreatorResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TradesByCreator'] = ResolversParentTypes['TradesByCreator']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  trades?: Resolver<Array<ResolversTypes['Trade']>, ParentType, ContextType, RequireFields<TradesByCreatortradesArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TradesByReceiverResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TradesByReceiver'] = ResolversParentTypes['TradesByReceiver']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  trades?: Resolver<Array<ResolversTypes['Trade']>, ParentType, ContextType, RequireFields<TradesByReceivertradesArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  PixelBalance?: PixelBalanceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Trade?: TradeResolvers<ContextType>;
  TradesByCreator?: TradesByCreatorResolvers<ContextType>;
  TradesByReceiver?: TradesByReceiverResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = MagicPixelsTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/magic-pixels/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const magicPixelsTransforms = [];
const additionalTypeDefs = [] as any[];
const magicPixelsHandler = new GraphqlHandler({
              name: "magic-pixels",
              config: {"endpoint":"https://graph.testnet.mantle.xyz/subgraphs/name/magic-pixels"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("magic-pixels"),
              logger: logger.child("magic-pixels"),
              importFn,
            });
magicPixelsTransforms[0] = new AutoPaginationTransform({
                  apiName: "magic-pixels",
                  config: {"validateSchema":true,"limitOfRecords":100},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
sources[0] = {
          name: 'magic-pixels',
          handler: magicPixelsHandler,
          transforms: magicPixelsTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: AccountLastBlockDocument,
        get rawSDL() {
          return printWithCache(AccountLastBlockDocument);
        },
        location: 'AccountLastBlockDocument.graphql'
      },{
        document: AllPixelsByAccountDocument,
        get rawSDL() {
          return printWithCache(AllPixelsByAccountDocument);
        },
        location: 'AllPixelsByAccountDocument.graphql'
      },{
        document: AllTradesForAccountDocument,
        get rawSDL() {
          return printWithCache(AllTradesForAccountDocument);
        },
        location: 'AllTradesForAccountDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type AccountLastBlockQueryVariables = Exact<{
  account: Scalars['ID'];
}>;


export type AccountLastBlockQuery = { account?: Maybe<Pick<Account, 'last_block'>> };

export type AllPixelsByAccountQueryVariables = Exact<{
  account: Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type AllPixelsByAccountQuery = { account?: Maybe<{ balances: Array<Pick<PixelBalance, 'pixel' | 'amount'>> }> };

export type AllTradesForAccountQueryVariables = Exact<{
  account: Scalars['ID'];
}>;


export type AllTradesForAccountQuery = { tradesByCreator?: Maybe<{ trades: Array<Pick<Trade, 'id' | 'creator' | 'receiver' | 'pixels' | 'price' | 'tradeType'>> }>, tradesByReceiver?: Maybe<{ trades: Array<Pick<Trade, 'id' | 'creator' | 'receiver' | 'pixels' | 'price' | 'tradeType'>> }> };


export const AccountLastBlockDocument = gql`
    query AccountLastBlock($account: ID!) {
  account(id: $account) {
    last_block
  }
}
    ` as unknown as DocumentNode<AccountLastBlockQuery, AccountLastBlockQueryVariables>;
export const AllPixelsByAccountDocument = gql`
    query AllPixelsByAccount($account: ID!, $first: Int = 100, $skip: Int = 0) {
  account(id: $account) {
    balances(first: $first, skip: $skip, where: {amount_gt: "0"}) {
      pixel
      amount
    }
  }
}
    ` as unknown as DocumentNode<AllPixelsByAccountQuery, AllPixelsByAccountQueryVariables>;
export const AllTradesForAccountDocument = gql`
    query AllTradesForAccount($account: ID!) {
  tradesByCreator(id: $account) {
    trades {
      id
      creator
      receiver
      pixels
      price
      tradeType
    }
  }
  tradesByReceiver(id: $account) {
    trades {
      id
      creator
      receiver
      pixels
      price
      tradeType
    }
  }
}
    ` as unknown as DocumentNode<AllTradesForAccountQuery, AllTradesForAccountQueryVariables>;




export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    AccountLastBlock(variables: AccountLastBlockQueryVariables, options?: C): Promise<AccountLastBlockQuery> {
      return requester<AccountLastBlockQuery, AccountLastBlockQueryVariables>(AccountLastBlockDocument, variables, options) as Promise<AccountLastBlockQuery>;
    },
    AllPixelsByAccount(variables: AllPixelsByAccountQueryVariables, options?: C): Promise<AllPixelsByAccountQuery> {
      return requester<AllPixelsByAccountQuery, AllPixelsByAccountQueryVariables>(AllPixelsByAccountDocument, variables, options) as Promise<AllPixelsByAccountQuery>;
    },
    AllTradesForAccount(variables: AllTradesForAccountQueryVariables, options?: C): Promise<AllTradesForAccountQuery> {
      return requester<AllTradesForAccountQuery, AllTradesForAccountQueryVariables>(AllTradesForAccountDocument, variables, options) as Promise<AllTradesForAccountQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;