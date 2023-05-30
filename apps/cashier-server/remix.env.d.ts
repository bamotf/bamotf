/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

// Utility type
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
