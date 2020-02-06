import ROUTER, { Spec } from 'koa-joi-router'
import re from '../../helpers/regex'
import setLang from '../../utils/set-lang'
import jwtVerify from '../../utils/jwt-verify'
import { resetPwdValidator } from './user-validators'
import userController from '../../controllers/user-controller'
import { errJoiOutput, errJoiHandler } from '../../utils/error-joi'

const { Joi } = ROUTER

export default class UserRoutes {

  public static publicRoutes: Spec[] = [

    /**
     * [POST] '/user/register'
     * To register user and send mail confirmation
    */
    {
      method: 'post',
      path: '/user/register',
      handler: [setLang, errJoiHandler, userController.mailRegUser],
      validate: {
        continueOnError: true,
        type: 'json',
        body: Joi.object({
          email: Joi.string().regex(re.email).required(),
          username: Joi.string().regex(re.username).required(),
          password: Joi.string().regex(re.password).required(),
          confirmPassword: Joi.string().regex(re.password).required(),
        }).options({ stripUnknown: true }),
        output: {
          '200, 400': {
            body: {
              msg: Joi.string().required().error(e => errJoiOutput(e)),
            },
          },
        },
      },
    },

    /**
     * [GET] '/user/confirmation/:token'
     * To confirm registration user (callback)
    */
    {
      method: 'get',
      path: '/user/confirmation/:token',
      handler: [setLang, errJoiHandler, userController.cbRegUser],
      validate: {
        params: {
          token: Joi.string().required(),
        },
      },
    },

    /**
     * [POST] '/user/authenticate'
     * To authenticate user
    */
    {
      method: 'post',
      path: '/user/authenticate',
      handler: [setLang, errJoiHandler, userController.authUser],
      validate: {
        continueOnError: true,
        type: 'json',
        body: Joi.object({
          email: Joi.string().regex(re.email).required(),
          password: Joi.string().regex(re.password).required(),
        }).options({ stripUnknown: true }),
        output: {
          200: {
            body: {
              msg: Joi.string().required().error(e => errJoiOutput(e)),
              token: Joi.string().required().error(e => errJoiOutput(e)),
            },
          },
          '400, 404': {
            body: {
              msg: Joi.string().required().error(e => errJoiOutput(e)),
            },
          },
        },
      },
    },
  ]

  public static privateRoutes: Spec[] = [

    /**
     * [GET] '/user'
     * To get user
    */
    {
      method: 'get',
      path: '/user',
      handler: [setLang, errJoiHandler, jwtVerify, userController.getUser],
      validate: {
        continueOnError: true,
        header: Joi.object({
          authorization: Joi.string().regex(re.jwt).required(),
        }).options({ allowUnknown: true }),
        output: {
          200: {
            body: {
              msg: Joi.string().required().error(e => errJoiOutput(e)),
              doc: Joi.object({
                username: Joi.string().required().error(e => errJoiOutput(e)),
                email: Joi.string().required().error(e => errJoiOutput(e)),
              }).options({ allowUnknown: true }),
            },
          },
          '400, 401, 404': {
            body: {
              msg: Joi.string().required().error(e => errJoiOutput(e)),
            },
          },
        },
      },
    },

    /**
     * [PUT] '/user'
     * To modify user
    */
    {
      method: 'put',
      path: '/user',
      handler: [setLang, errJoiHandler, jwtVerify, userController.updUser],
      validate: {
        continueOnError: true,
        type: 'json',
        header: Joi.object({
          authorization: Joi.string().regex(re.jwt).required(),
        }).options({ allowUnknown: true }),
        body: Joi.object({
          username: Joi.string().regex(re.username),
        }).min(1).options({ stripUnknown: true }),
        output: {
          200: {
            body: {
              msg: Joi.string().required().error(e => errJoiOutput(e)),
              doc: Joi.object({
                username: Joi.string().required().error(e => errJoiOutput(e)),
              }).options({ allowUnknown: true }),
            },
          },
          '400, 401, 404': {
            body: {
              msg: Joi.string().required().error(e => errJoiOutput(e)),
            },
          },
        },
      },
    },

    /**
     * [PUT] '/user/password'
     * To modify user password
    */
    {
      method: 'put',
      path: '/user/password',
      handler: [setLang, errJoiHandler, jwtVerify, userController.resetPwd],
      validate: {
        body: Joi.object({
          password: Joi.string().regex(re.password).required(),
          newPassword: Joi.string().regex(re.password).required(),
          confirmNewPassword: Joi.string().regex(re.password).required(),
        }).options({ stripUnknown: true }),
        ...resetPwdValidator,
      },
    },

    /**
     * [POST] '/user/reset-password'
     * To send mail reset password
    */
    {
      method: 'post',
      path: '/user/reset-password',
      handler: [setLang, errJoiHandler, userController.mailResetPwd],
      validate: {
        continueOnError: true,
        type: 'json',
        body: Joi.object({
          email: Joi.string().regex(re.email).required(),
        }).options({ stripUnknown: true }),
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
      },
    },

    /**
     * [PUT] '/user/reset-password'
     * To reset user password
    */
    {
      method: 'put',
      path: '/user/reset-password',
      handler: [setLang, errJoiHandler, jwtVerify, userController.resetPwd],
      validate: {
        body: Joi.object({
          newPassword: Joi.string().regex(re.password).required(),
          confirmNewPassword: Joi.string().regex(re.password).required(),
        }).options({ stripUnknown: true }),
        ...resetPwdValidator,
      },
    },

    /**
     * [POST] '/user/change-email'
     * To send mail to modify user email
    */
    {
      method: 'post',
      path: '/user/change-email',
      handler: [setLang, errJoiHandler, jwtVerify, userController.mailChangeEmail],
      validate: {
        continueOnError: true,
        type: 'json',
        header: Joi.object({
          authorization: Joi.string().regex(re.jwt).required(),
        }).options({ allowUnknown: true }),
        body: Joi.object({
          newEmail: Joi.string().regex(re.email).required(),
        }).options({ stripUnknown: true }),
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
      },
    },

    /**
     * [GET] '/user/change-email/:token'
     * To modify user email (callback)
    */
    {
      method: 'get',
      path: '/user/change-email/:token',
      handler: [setLang, errJoiHandler, userController.cbChangeEmail],
      validate: {
        params: {
          token: Joi.string().required(),
        },
      },
    },

    /**
     * [DELETE] '/user'
     * To delete user
    */
    {
      method: 'delete',
      path: '/user',
      handler: [setLang, errJoiHandler, jwtVerify, userController.delUser],
      validate: {
        continueOnError: true,
        type: 'json',
        header: Joi.object({
          authorization: Joi.string().regex(re.jwt).required(),
        }).options({ allowUnknown: true }),
        body: Joi.object({
          email: Joi.string().regex(re.email).required(),
        }).options({ stripUnknown: true }),
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
      },
    },

  ]

}
