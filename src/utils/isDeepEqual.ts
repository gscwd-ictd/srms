type DeepEqualityConfig = {
  ignoreUndefined?: boolean;
  ignoreArrayOrder?: boolean;
  ignoreCase?: boolean;
};

// Define a recursive type that can represent nested structures
type Primitive = string | number | boolean | Date | RegExp | null | undefined;
type NestedValue = Primitive | NestedObject | NestedArray;
type NestedObject = { [key: string]: NestedValue };
type NestedArray = NestedValue[];

export function isDeepEqual<T extends NestedValue>(
  obj1: T,
  obj2: T,
  config: DeepEqualityConfig = {},
): boolean {
  // Handle primitive types and null
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== typeof obj2) return false;

  // Handle Date objects
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  // Handle RegExp objects
  if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
    return obj1.toString() === obj2.toString();
  }

  // Handle strings with case-insensitive option
  if (config.ignoreCase && typeof obj1 === "string" && typeof obj2 === "string") {
    return obj1.toLowerCase() === obj2.toLowerCase();
  }

  // Handle Arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;

    if (config.ignoreArrayOrder) {
      // Note: This assumes array elements are comparable/sortable
      const sortedArr1 = [...obj1].sort();
      const sortedArr2 = [...obj2].sort();
      return sortedArr1.every((item, index) =>
        isDeepEqual(item as NestedValue, sortedArr2[index] as NestedValue, config),
      );
    }

    return obj1.every((item, index) => isDeepEqual(item as NestedValue, obj2[index] as NestedValue, config));
  }

  // Handle Objects
  if (typeof obj1 === "object" && typeof obj2 === "object") {
    const keys1 = Object.keys(obj1 as object);
    const keys2 = Object.keys(obj2 as object);

    // Handle ignoreUndefined option
    const relevantKeys1 = config.ignoreUndefined
      ? keys1.filter((key) => (obj1 as NestedObject)[key] !== undefined)
      : keys1;
    const relevantKeys2 = config.ignoreUndefined
      ? keys2.filter((key) => (obj2 as NestedObject)[key] !== undefined)
      : keys2;

    if (relevantKeys1.length !== relevantKeys2.length) return false;

    return relevantKeys1.every((key) => {
      if (!relevantKeys2.includes(key)) return false;
      const val1 = (obj1 as NestedObject)[key];
      const val2 = (obj2 as NestedObject)[key];
      return isDeepEqual(val1 as NestedValue, val2 as NestedValue, config);
    });
  }

  return false;
}
