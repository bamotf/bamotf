import {BamOtf} from '@bam-otf/node'

const apiKey = process.env.BAMOTF_API_KEY
if (!apiKey) {
  throw new Error('BAMOTF_API_KEY not set')
}

export const bamotf = new BamOtf(apiKey)
