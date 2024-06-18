type ValueOf<T> = T[keyof T];

export const mapObject = <OldObject extends object, NewValue>(
  obj: OldObject,
  mappingFn: (value: ValueOf<OldObject>) => NewValue,
): Record<keyof OldObject, NewValue> => {
  const newObj = {} as Record<keyof OldObject, NewValue>;
  // eslint-disable-next-line no-restricted-syntax
  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      const oldValue = obj[i];
      newObj[i] = mappingFn(oldValue);
    }
  }
  return newObj;
};
