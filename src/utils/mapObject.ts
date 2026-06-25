type ValueOf<T> = T[keyof T];

export const mapObject = <OldObject extends object, NewValue>(
  obj: OldObject,
  mappingFn: (value: ValueOf<OldObject>) => NewValue,
): Record<keyof OldObject, NewValue> => {
  const newObj = {} as Record<keyof OldObject, NewValue>;

  for (const i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
      continue;
    }

    // eslint-disable-next-line unicorn/no-unsafe-property-key
    const oldValue = obj[i];

    // eslint-disable-next-line unicorn/no-unsafe-property-key
    newObj[i] = mappingFn(oldValue);
  }
  return newObj;
};
