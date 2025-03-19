export const CLASS_MARKER = Symbol('CLASS_MARKER');

export interface Class {
  [CLASS_MARKER]: true;
}

export namespace Class {
  export interface Clonable {
    clone(): this;
  }
}
