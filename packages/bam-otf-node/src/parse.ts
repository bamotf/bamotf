type NonJsonTypes =
  | 'date'
  | 'set'
  | 'map'
  | 'regexp'
  | 'bigint'
  | 'undefined'
  | 'infinity'
  | '-infinity'
  | 'nan'
  | 'error'
type MetaType = Record<string, NonJsonTypes>

export function parse({
  __meta__,
  ...data
}: {
  __meta__: MetaType
  [key: string]: unknown
}) {
  return applyMeta(data, __meta__)
}

function applyMeta<T>(data: T, meta: MetaType) {
  for (const key of Object.keys(meta)) {
    applyConversion(data, key.split('.'), meta[key])
  }
  return data

  function applyConversion(
    data: any,
    keys: string[],
    type: NonJsonTypes,
    depth: number = 0,
  ) {
    const key = keys[depth]
    if (depth < keys.length - 1) {
      applyConversion(data[key], keys, type, depth + 1)
      return
    }
    const value = data[key]
    switch (type) {
      case 'date':
        data[key] = new Date(value)
        break
      case 'set':
        data[key] = new Set(value)
        break
      case 'map':
        data[key] = new Map(Object.entries(value))
        break
      case 'regexp':
        const match = /^\/(.*)\/([dgimsuy]*)$/.exec(value)
        if (match) {
          data[key] = new RegExp(match[1], match[2])
        } else {
          throw new Error(`Invalid regexp: ${value}`)
        }
        break
      case 'bigint':
        data[key] = BigInt(value)
        break
      case 'undefined':
        data[key] = undefined
        break
      case 'infinity':
        data[key] = Number.POSITIVE_INFINITY
        break
      case '-infinity':
        data[key] = Number.NEGATIVE_INFINITY
        break
      case 'nan':
        data[key] = NaN
        break
      case 'error':
        const err = new Error(value.message)
        err.name = value.name
        err.stack = value.stack
        data[key] = err
        break
    }
  }
}
