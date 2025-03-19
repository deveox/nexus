export function deepEqualPOJO(a: any, b: any): boolean {
  switch (typeof a) {
    case 'object': {
      if (a === null) {
        return a === b;
      }
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!deepEqualPOJO(a[i], b[i])) {
            return false;
          }
        }
        return true;
      }
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (!deepEqualPOJO(aKeys, bKeys)) {
        return false;
      }
      for (const k of aKeys) {
        const res = deepEqualPOJO(a[k], b[k]);
        if (!res) {
          return false;
        }
      }
      return true;
    }
    default:
      return a === b;
  }
}
