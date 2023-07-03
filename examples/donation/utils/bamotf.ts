import {BamOtf} from '@bam-otf/node'

import {env} from '../../../env/env'

const apiKey = env.BAMOTF_API_KEY
if (!apiKey) {
  throw new Error('BAMOTF_API_KEY not set')
}

export const bamotf = new BamOtf(apiKey)
