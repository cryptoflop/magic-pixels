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

export class Conjured extends ethereum.Event {
  get params(): Conjured__Params {
    return new Conjured__Params(this);
  }
}

export class Conjured__Params {
  _event: Conjured;

  constructor(event: Conjured) {
    this._event = event;
  }

  get conjurer(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get pixels(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class Minted extends ethereum.Event {
  get params(): Minted__Params {
    return new Minted__Params(this);
  }
}

export class Minted__Params {
  _event: Minted;

  constructor(event: Minted) {
    this._event = event;
  }

  get minter(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get pixels(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class PxlsCore extends ethereum.SmartContract {
  static bind(address: Address): PxlsCore {
    return new PxlsCore("PxlsCore", address);
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

export class ConjureCall extends ethereum.Call {
  get inputs(): ConjureCall__Inputs {
    return new ConjureCall__Inputs(this);
  }

  get outputs(): ConjureCall__Outputs {
    return new ConjureCall__Outputs(this);
  }
}

export class ConjureCall__Inputs {
  _call: ConjureCall;

  constructor(call: ConjureCall) {
    this._call = call;
  }

  get numPixels(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ConjureCall__Outputs {
  _call: ConjureCall;

  constructor(call: ConjureCall) {
    this._call = call;
  }
}

export class MintCall extends ethereum.Call {
  get inputs(): MintCall__Inputs {
    return new MintCall__Inputs(this);
  }

  get outputs(): MintCall__Outputs {
    return new MintCall__Outputs(this);
  }
}

export class MintCall__Inputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }

  get pixels(): Array<Array<i32>> {
    return this._call.inputValues[0].value.toI32Matrix();
  }

  get delays(): Array<Array<BigInt>> {
    return this._call.inputValues[1].value.toBigIntMatrix();
  }
}

export class MintCall__Outputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }
}

export class RestoreCall extends ethereum.Call {
  get inputs(): RestoreCall__Inputs {
    return new RestoreCall__Inputs(this);
  }

  get outputs(): RestoreCall__Outputs {
    return new RestoreCall__Outputs(this);
  }
}

export class RestoreCall__Inputs {
  _call: RestoreCall;

  constructor(call: RestoreCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get plate(): Array<Array<i32>> {
    return this._call.inputValues[1].value.toI32Matrix();
  }
}

export class RestoreCall__Outputs {
  _call: RestoreCall;

  constructor(call: RestoreCall) {
    this._call = call;
  }
}