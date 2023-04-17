import {z} from '../utils/zod'

const XpubSchema = z.string().regex(/^xpub[a-zA-HJ-NP-Z0-9]{107}$/)
const YpubSchema = z.string().regex(/^ypub[a-zA-HJ-NP-Z0-9]{107}$/)
const ZpubSchema = z.string().regex(/^zpub[a-zA-HJ-NP-Z0-9]{78}$/)

export const ExtendedPublicKeySchema = XpubSchema.or(YpubSchema).or(ZpubSchema)
