/* eslint-disable import/prefer-default-export */
import ROUTER from 'koa-joi-router'
import re from '../../helpers/regex'
import { errJoiOutput } from '../../utils/error-joi'

const { Joi } = ROUTER

export const resetPwdValidator = {
  continueOnError: true,
  type: 'json' as 'json' | 'form' | 'multipart',
  header: Joi.object({
    authorization: Joi.string().regex(re.jwt).required(),
  }).options({ allowUnknown: true }),
  output: {
    200: {
      body: {
        msg: Joi.string().required().error(e => errJoiOutput(e)),
      },
    },
    '400, 401, 404': {
      body: {
        msg: Joi.string().required().error(e => errJoiOutput(e)),
      },
    },
  },
}
