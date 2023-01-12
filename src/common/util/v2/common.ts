import { categories } from 'src/common/config/category';

// 선택한 속성을 제거한 객체 반환
export const exclude = <T, Key extends keyof T>(
  object: T,
  keys: Key[],
): Omit<T, Key> => {
  for (const key of keys) delete object[key];
  return object;
};

export const includes = <T>(list: T, key: any) => {
  return list[key] ? true : false;
};

// export const seperate = <T, Key extends keyof T>(object: T, keys: Key[]) => {
//   const partials = new Map<Key, any>();
//   for (const key of keys) partials.set(key, object[key]);
// };

includes(categories, 'plastic');
