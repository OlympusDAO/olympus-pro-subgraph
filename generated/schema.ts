// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Bond extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Bond entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Bond entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Bond", id.toString(), this);
  }

  static load(id: string): Bond | null {
    return store.get("Bond", id) as Bond | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get token0(): string {
    let value = this.get("token0");
    return value.toString();
  }

  set token0(value: string) {
    this.set("token0", Value.fromString(value));
  }

  get token1(): string {
    let value = this.get("token1");
    return value.toString();
  }

  set token1(value: string) {
    this.set("token1", Value.fromString(value));
  }

  get treasury(): string {
    let value = this.get("treasury");
    return value.toString();
  }

  set treasury(value: string) {
    this.set("treasury", Value.fromString(value));
  }

  get principleToken(): string {
    let value = this.get("principleToken");
    return value.toString();
  }

  set principleToken(value: string) {
    this.set("principleToken", Value.fromString(value));
  }

  get payoutToken(): string {
    let value = this.get("payoutToken");
    return value.toString();
  }

  set payoutToken(value: string) {
    this.set("payoutToken", Value.fromString(value));
  }

  get fees(): BigDecimal {
    let value = this.get("fees");
    return value.toBigDecimal();
  }

  set fees(value: BigDecimal) {
    this.set("fees", Value.fromBigDecimal(value));
  }

  get type(): string {
    let value = this.get("type");
    return value.toString();
  }

  set type(value: string) {
    this.set("type", Value.fromString(value));
  }
}

export class UserBond extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save UserBond entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save UserBond entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("UserBond", id.toString(), this);
  }

  static load(id: string): UserBond | null {
    return store.get("UserBond", id) as UserBond | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get bond(): string {
    let value = this.get("bond");
    return value.toString();
  }

  set bond(value: string) {
    this.set("bond", Value.fromString(value));
  }

  get deposit(): BigDecimal | null {
    let value = this.get("deposit");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set deposit(value: BigDecimal | null) {
    if (value === null) {
      this.unset("deposit");
    } else {
      this.set("deposit", Value.fromBigDecimal(value as BigDecimal));
    }
  }

  get payout(): BigDecimal | null {
    let value = this.get("payout");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set payout(value: BigDecimal | null) {
    if (value === null) {
      this.unset("payout");
    } else {
      this.set("payout", Value.fromBigDecimal(value as BigDecimal));
    }
  }

  get depositUSD(): BigDecimal | null {
    let value = this.get("depositUSD");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set depositUSD(value: BigDecimal | null) {
    if (value === null) {
      this.unset("depositUSD");
    } else {
      this.set("depositUSD", Value.fromBigDecimal(value as BigDecimal));
    }
  }

  get payoutUSD(): BigDecimal | null {
    let value = this.get("payoutUSD");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set payoutUSD(value: BigDecimal | null) {
    if (value === null) {
      this.unset("payoutUSD");
    } else {
      this.set("payoutUSD", Value.fromBigDecimal(value as BigDecimal));
    }
  }
}
