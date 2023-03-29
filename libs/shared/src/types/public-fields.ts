type PublicFields<T> = {
  [P in keyof T]: T[P];
};