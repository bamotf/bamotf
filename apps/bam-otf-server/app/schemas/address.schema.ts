import {z} from '~/utils/zod'

// Mainet addresses
const P2PKHAddressSchema = z.string().regex(/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/)
const P2SHAddressSchema = z.string().regex(/^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/)
const Bech32AddressSchema = z.string().regex(/^bc1[ac-hj-np-z02-9]{11,71}$/)

// Testnet addresses
// export const P2PKHAddressSchema = z.string().regex(/^m[a-km-zA-HJ-NP-Z1-9]{25,34}$/)
// export const P2SHAddressSchema = z.string().regex(/^2[a-km-zA-HJ-NP-Z1-9]{25,34}$/)
// export const Bech32AddressSchema = z.string().regex(/^tb1[ac-hj-np-z02-9]{11,71}$/)

// Regtest addresses
// export const P2PKHAddressSchema = z.string().regex(/^m[a-km-zA-HJ-NP-Z1-9]{25,34}$/)
// export const P2SHAddressSchema = z.string().regex(/^2[a-km-zA-HJ-NP-Z1-9]{25,34}$/)
// export const Bech32AddressSchema = z.string().regex(/^tb1[ac-hj-np-z02-9]{11,71}$/)

export const AddressSchema =
  P2PKHAddressSchema.or(P2SHAddressSchema).or(Bech32AddressSchema)
