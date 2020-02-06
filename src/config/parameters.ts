/* eslint-disable no-nested-ternary */
const ENV = process.env

export default {
  port: ENV.PROD_ENV ? +ENV.PROD_PORT : 3030,
  jwtSecret: ENV.PROD_ENV ? ENV.JWT_SECRET : '12345678901234567',
  hostname: ENV.PROD_ENV ? ENV.PROD_API : 'http://localhost:3030/',
  website: ENV.PROD_ENV ? ENV.PROD_WEBSITE : 'https://www.mywebsite.fr/',
  mongoUri: ENV.PROD_ENV ? ENV.PROD_MONGO : 'mongodb://dbuser:dbpass@mongo:27017/dbdev',
}
