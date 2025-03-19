export class ChangeTracker<T extends Record<string, any>> {
  static MARKER = Symbol('ChangeTracker.MARKER');
  #changes: ChangeTracker.Changes<T> = {};
  track<T extends Record<string, any>>(target: T, prefix?: string) {
    return new Proxy(target, {
      get: (target, key, receiver) => {
        const data = Reflect.get(target, key, receiver);
        if (typeof key === 'symbol') {
          if (key === ChangeTracker.MARKER) {
            return target;
          }
          return data;
        }

        if (Array.isArray(target)) {
          switch (key) {
            case 'pop':
            case 'shift':
            case 'unshift':
            case 'splice':
            case 'sort':
            case 'reverse':
            case 'fill':
              return (...args: any[]) => {
                const old = [...target];
                (target[key] as any)(...args);
                this.add(prefix ?? '', old, target);
              };
          }
        }

        if (typeof data === 'object') {
          if (data === null) {
            return data;
          }
          if (ChangeTracker.MARKER in data) {
            return data;
          }
          const proxy = this.track(data, prefix ? `${prefix}.${key}` : key);
          (target as any)[key] = proxy;
          return proxy;
        }
        return data;
      },
      set: (target, key, value, receiver) => {
        if (typeof key === 'symbol' || (Array.isArray(target) && key === 'length')) {
          return Reflect.set(target, key, value, receiver);
        }
        const oldValue = target[key];
        const newValue = value;
        this.add(prefix ? `${prefix}.${key}` : key, oldValue, newValue);
        return Reflect.set(target, key, value, receiver);
      },
    });
  }

  get changes() {
    return this.#changes;
  }

  clear() {
    this.#changes = {};
  }

  has(key: keyof T) {
    return this.#changes[key] !== undefined;
  }

  get(key: keyof T) {
    return this.#changes[key];
  }

  add(key: keyof T, oldValue: unknown, newValue: unknown) {
    if (oldValue === newValue) {
      return;
    }
    this.#changes[key] = {
      oldValue,
      newValue,
    };
  }

  remove(key: keyof T) {
    delete this.#changes[key];
  }
}

export namespace ChangeTracker {
  export type Changes<T extends Record<string, any>> = Partial<Record<keyof T, Change>>;
  export type Change = {
    oldValue: unknown;
    newValue: unknown;
  };
}
