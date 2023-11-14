// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class TradeCanceled extends ethereum.Event {
  get params(): TradeCanceled__Params {
    return new TradeCanceled__Params(this);
  }
}

export class TradeCanceled__Params {
  _event: TradeCanceled;

  constructor(event: TradeCanceled) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get trade(): TradeCanceledTradeStruct {
    return changetype<TradeCanceledTradeStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class TradeCanceledTradeStruct extends ethereum.Tuple {
  get creator(): Address {
    return this[0].toAddress();
  }

  get receiver(): Address {
    return this[1].toAddress();
  }

  get pixels(): Bytes {
    return this[2].toBytes();
  }

  get price(): BigInt {
    return this[3].toBigInt();
  }

  get tradeType(): i32 {
    return this[4].toI32();
  }
}

export class TradeClosed extends ethereum.Event {
  get params(): TradeClosed__Params {
    return new TradeClosed__Params(this);
  }
}

export class TradeClosed__Params {
  _event: TradeClosed;

  constructor(event: TradeClosed) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get trade(): TradeClosedTradeStruct {
    return changetype<TradeClosedTradeStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class TradeClosedTradeStruct extends ethereum.Tuple {
  get creator(): Address {
    return this[0].toAddress();
  }

  get receiver(): Address {
    return this[1].toAddress();
  }

  get pixels(): Bytes {
    return this[2].toBytes();
  }

  get price(): BigInt {
    return this[3].toBigInt();
  }

  get tradeType(): i32 {
    return this[4].toI32();
  }
}

export class TradeOpened extends ethereum.Event {
  get params(): TradeOpened__Params {
    return new TradeOpened__Params(this);
  }
}

export class TradeOpened__Params {
  _event: TradeOpened;

  constructor(event: TradeOpened) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get trade(): TradeOpenedTradeStruct {
    return changetype<TradeOpenedTradeStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class TradeOpenedTradeStruct extends ethereum.Tuple {
  get creator(): Address {
    return this[0].toAddress();
  }

  get receiver(): Address {
    return this[1].toAddress();
  }

  get pixels(): Bytes {
    return this[2].toBytes();
  }

  get price(): BigInt {
    return this[3].toBigInt();
  }

  get tradeType(): i32 {
    return this[4].toI32();
  }
}

export class TrdsCore__getTradeResultValue0Struct extends ethereum.Tuple {
  get creator(): Address {
    return this[0].toAddress();
  }

  get receiver(): Address {
    return this[1].toAddress();
  }

  get pixels(): Bytes {
    return this[2].toBytes();
  }

  get price(): BigInt {
    return this[3].toBigInt();
  }

  get tradeType(): i32 {
    return this[4].toI32();
  }
}

export class TrdsCore extends ethereum.SmartContract {
  static bind(address: Address): TrdsCore {
    return new TrdsCore("TrdsCore", address);
  }

  getTrade(id: Bytes): TrdsCore__getTradeResultValue0Struct {
    let result = super.call(
      "getTrade",
      "getTrade(bytes32):((address,address,bytes,uint256,uint8))",
      [ethereum.Value.fromFixedBytes(id)]
    );

    return changetype<TrdsCore__getTradeResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getTrade(
    id: Bytes
  ): ethereum.CallResult<TrdsCore__getTradeResultValue0Struct> {
    let result = super.tryCall(
      "getTrade",
      "getTrade(bytes32):((address,address,bytes,uint256,uint8))",
      [ethereum.Value.fromFixedBytes(id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<TrdsCore__getTradeResultValue0Struct>(value[0].toTuple())
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CancelTradeCall extends ethereum.Call {
  get inputs(): CancelTradeCall__Inputs {
    return new CancelTradeCall__Inputs(this);
  }

  get outputs(): CancelTradeCall__Outputs {
    return new CancelTradeCall__Outputs(this);
  }
}

export class CancelTradeCall__Inputs {
  _call: CancelTradeCall;

  constructor(call: CancelTradeCall) {
    this._call = call;
  }

  get id(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class CancelTradeCall__Outputs {
  _call: CancelTradeCall;

  constructor(call: CancelTradeCall) {
    this._call = call;
  }
}

export class CloseTradeCall extends ethereum.Call {
  get inputs(): CloseTradeCall__Inputs {
    return new CloseTradeCall__Inputs(this);
  }

  get outputs(): CloseTradeCall__Outputs {
    return new CloseTradeCall__Outputs(this);
  }
}

export class CloseTradeCall__Inputs {
  _call: CloseTradeCall;

  constructor(call: CloseTradeCall) {
    this._call = call;
  }

  get id(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class CloseTradeCall__Outputs {
  _call: CloseTradeCall;

  constructor(call: CloseTradeCall) {
    this._call = call;
  }
}

export class OpenTradeCall extends ethereum.Call {
  get inputs(): OpenTradeCall__Inputs {
    return new OpenTradeCall__Inputs(this);
  }

  get outputs(): OpenTradeCall__Outputs {
    return new OpenTradeCall__Outputs(this);
  }
}

export class OpenTradeCall__Inputs {
  _call: OpenTradeCall;

  constructor(call: OpenTradeCall) {
    this._call = call;
  }

  get receiver(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get pixels(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get price(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get tradeType(): i32 {
    return this._call.inputValues[3].value.toI32();
  }
}

export class OpenTradeCall__Outputs {
  _call: OpenTradeCall;

  constructor(call: OpenTradeCall) {
    this._call = call;
  }
}