import {BamOtf} from '@bam-otf/node'

// @ts-expect-error
// eslint-disable-next-line turbo/no-undeclared-env-vars
export const bamotf = new BamOtf(process.env.BAMOTF_API_KEY)
