export const checkValues = <T>(
  p1: T,
  p2: T,
  checker: (arg0: T, arg1: T) => boolean,
) => {
  return checker(p1, p2);
};

export const checkBoolean = (flag: any, err: Error) => {
  if (!flag) throw err;
};

export const seperate = (object: Object, ...keys: string[]) => {
  const rst = {};
  for (const key in keys) rst[key] = object[key];
  for (const key in keys) delete object[key];
  rst['rest'] = object;

  return rst;
};

export const exclude = <T, Key extends keyof T>(
  object: T,
  keys: Key[],
): Omit<T, Key> => {
  for (const key of keys) delete object[key];
  return object;
};

export const flat = <T extends Object, K extends keyof T>(
  object: T,
  keys: K[],
) => {
  // for(const key of keys) object.hasOwnProperty(key)?object[key] instanceof Object?
};
