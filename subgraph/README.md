# Example Subgraph for Mantle Testnet

An example to help you get started with graph service for mantle testnet. 
For more information see the docs on https://thegraph.com/docs/.

## Example subgraph 

https://graph.testnet.mantle.xyz/subgraphs/name/example/graphql

## install dependencies

install foundry tools to ./bin

```bash
# for mac silicon chip, pls select the version fit your os/cpu platform
pkg=https://github.com/foundry-rs/foundry/releases/download/nightly/foundry_nightly_darwin_arm64.tar.gz

curl -sSL $pkg | tar xzf - -C ./bin

export $PATH=$PWD/bin:$PATH
```

install node packages

```bash

yarn

```

## Deploy

### Deploy an simple example contract

optional, or just use `0x1de239E2D98dea46C10D6D14F5E9EB427fdE6059` we deployed already

```bash

bin/forge create --legacy --rpc-url https://rpc.testnet.mantle.xyz \
    --private-key 0x... \
    --from 0x...\
    contracts/Gravity.sol:GravatarRegistry

Deployer: 0x00000500E87eE83A1BFa233512af25a4003836C8
Deployed to: 0x1de239E2D98dea46C10D6D14F5E9EB427fdE6059
Transaction hash: 0x4cf8fa85b6cb253cf8222c0863eea3607b31c5c168a9170262723077d674eb22

```

### Deploy Subgraph


```bash

# modify contract address and startBlock to apropriate value in subgraph.yaml 
vim subgraph.yaml

yarn codegen

# see pacakges.json for what redo does
yarn redeploy

```

### Send some tx by calling the contract

```bash
# replace the 0x.. to your real EOA
bin/cast send --legacy --rpc-url https://rpc.testnet.mantle.xyz \
    --private-key 0x.. \
    --from 0x.. \
    0x1de239E2D98dea46C10D6D14F5E9EB427fdE6059 \
    "createGravatar(string,string)" "Alice" "https://google.com/a.jpg"

```

Then you can query indexed data from https://graph.testnet.mantle.xyz/subgraphs/name/example/graphql .