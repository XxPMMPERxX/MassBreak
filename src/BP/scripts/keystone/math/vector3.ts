import { Vector3 } from '@minecraft/server';

export class _Vector3 implements Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * ゼロベクトルで生成
   * @return {_Vector3}
   */
  static zero(): _Vector3 {
    return new _Vector3(0, 0, 0);
  }

  /**
   * {x, y, z} オブジェクトから生成
   * @param {Vector3} pos 
   * @returns 
   */
  static fromBDS(pos: Vector3): _Vector3 {
    return new _Vector3(pos.x, pos.y, pos.z);
  }

  // ===== 基本ゲッター =====
  getX(): number { 
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getZ(): number {
    return this.z;
  }

  getFloorX(): number {
    return Math.floor(this.x);
  }

  getFloorY(): number {
    return Math.floor(this.y);
  }

  getFloorZ(): number {
    return Math.floor(this.z);
  }

  /**
   * 加算
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @return {_Vector3}
   */
  add(x: number, y: number, z: number): _Vector3 {
    return new _Vector3(
      this.x + x,
      this.y + y,
      this.z + z
    );
  }

  /**
   * ベクトル単位での加算
   * @param {Vector3} v 
   * @returns {_Vector3}
   */
  addVector(v: Vector3): _Vector3 {
    return this.add(v.x, v.y, v.z);
  }

  /**
   * 減算
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {_Vector3}
   */
  subtract(x: number, y: number, z: number): _Vector3 {
    return this.add(-x, -y, -z);
  }

  /**
   * ベクトル単位での減算
   * @param {Vector3} v
   * @return {_Vector3}
   */
  subtractVector(v: Vector3): _Vector3 {
    return this.add(-v.x, -v.y, -v.z);
  }

  /**
   * 乗算
   * @param {number} value
   * @return {_Vector3}
   */
  multiply(value: number): _Vector3 {
    return new _Vector3(
      this.x * value,
      this.y * value,
      this.z * value
    );
  }

  /**
   * 除算
   * @param {number} value
   * @return {_Vector3}
   */
  divide(value: number): _Vector3 {
    return new _Vector3(
      this.x / value,
      this.y / value,
      this.z / value
    );
  }

  /**
   * ベクトルの内部数値小数点切り上げ
   * @return {_Vector3}
   */
  ceil(): _Vector3 {
    return new _Vector3(
      Math.ceil(this.x),
      Math.ceil(this.y),
      Math.ceil(this.z)
    );
  }

  /**
   * ベクトルの内部数値小数点切り捨て
   * @return {_Vector3}
   */
  floor(): _Vector3 {
    return new _Vector3(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.z)
    );
  }

  /**
   * ベクトルの内部数値小数点四捨五入
   * @param {number} precision
   * @return {_Vector3}
   */
  round(precision: number = 0): _Vector3 {
    const factor = Math.pow(10, precision);
    return new _Vector3(
      Math.round(this.x * factor) / factor,
      Math.round(this.y * factor) / factor,
      Math.round(this.z * factor) / factor
    );
  }

  /**
   * ベクトルの内部数値の絶対値
   * @return {_Vector3}
   */
  abs(): _Vector3 {
    return new _Vector3(
      Math.abs(this.x),
      Math.abs(this.y),
      Math.abs(this.z)
    );
  }

  /**
   * 指定した2点間のユークリッド距離
   * @param {Vector3} pos 
   * @return {number}
   */
  distance(pos: Vector3): number {
    return Math.sqrt(this.distanceSquared(pos));
  }

  /**
   * 指定した2点間のユークリッド距離の2乗
   * @param {Vector3} pos 
   * @return {number}
   */
  distanceSquared(pos: Vector3): number {
    const dx = this.x - pos.x;
    const dy = this.y - pos.y;
    const dz = this.z - pos.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * 内積
   * @param {Vector3} pos 
   * @return {number}
   */
  dot(pos: Vector3): number {
    return this.x * pos.x + this.y * pos.y + this.z * pos.z;
  }

  /**
   * 外積
   * @param {Vector3} pos 
   * @return {_Vector3}
   */
  cross(pos: Vector3): _Vector3 {
    return new _Vector3(
      this.y * pos.z - this.z * pos.y,
      this.z * pos.x - this.x * pos.z,
      this.x * pos.y - this.y * pos.x
    );
  }

  /**
   * ベクトルの比較
   * @param {Vector3} pos 
   * @return {boolean}
   */
  equals(pos: Vector3): boolean {
    return this.x === pos.x && this.y === pos.y && this.z === pos.z;
  }

  /**
   * ベクトルの長さ
   * @return {number}
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * ベクトルの長さの2乗
   * @return {number}
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * 正規化
   * @return {_Vector3}
   */
  normalize(): _Vector3 {
    const len = this.length();
    if (len > 0) {
      return this.divide(len);
    }
    return new _Vector3(0, 0, 0);
  }

  /**
   * オブジェクトの数値指定再生成
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @return {_Vector3}
   */
  withComponents(x?: number, y?: number, z?: number): _Vector3 {
    return new _Vector3(
      x !== undefined ? x : this.x,
      y !== undefined ? y : this.y,
      z !== undefined ? z : this.z
    );
  }

  /**
   * BDS ScriptAPIで使える {x, y, z} 形式に変換
   * @returns {Vector3}
   */
  toBDS(): Vector3 {
    return { x: this.x, y: this.y, z: this.z };
  }

  /** 通常のオブジェクトに変換 */
  toObject(): {x: number; y: number; z: number} {
    return { x: this.x, y: this.y, z: this.z };
  }

  toString(): string {
    return `Vector3(x=${this.x}, y=${this.y}, z=${this.z})`;
  }

  /**
   * 最大点
   * @param {Vector3} vector
   * @param {Vector3[]} vectors 
   * @returns {_Vector3}
   */
  static maxComponents(
    vector: Vector3,
    ...vectors: Vector3[]
  ): _Vector3 {
    let x = vector.x;
    let y = vector.y;
    let z = vector.z;
    for (const pos of vectors) {
      x = Math.max(x, pos.x);
      y = Math.max(y, pos.y);
      z = Math.max(z, pos.z);
    }
    return new _Vector3(x, y, z);
  }

  /**
   * 最小点
   * @param {Vector3} vector
   * @param {Vector3[]} vectors 
   * @returns {_Vector3}
   */
  static minComponents(
    vector: Vector3,
    ...vectors: Vector3[]
  ): _Vector3 {
    let x = vector.x;
    let y = vector.y;
    let z = vector.z;
    for (const pos of vectors) {
      x = Math.min(x, pos.x);
      y = Math.min(y, pos.y);
      z = Math.min(z, pos.z);
    }
    return new _Vector3(x, y, z);
  }

  /**
   * 合計
   * @param {Vector3[]} vectors
   * @returns {_Vector3}
   */
  static sum(...vectors: {x: number; y: number; z: number}[]): _Vector3 {
    let x = 0, y = 0, z = 0;
    for (const v of vectors) {
      x += v.x;
      y += v.y;
      z += v.z;
    }
    return new _Vector3(x, y, z);
  }
}
