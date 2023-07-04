import {BamOtf} from '@bam-otf/node'

import {env} from './env'

export const bamotf = new BamOtf(env.API_KEY)
