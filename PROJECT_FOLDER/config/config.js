require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: 'data_kepegawaian',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USER_TEST || 'postgres',
    password: process.env.DB_PASS_TEST,
    database: 'data_kepegawaian_test',
    host: process.env.DB_HOST_TEST || 'localhost',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER_PROD || 'postgres',
    password: process.env.DB_PASS_PROD,
    database: 'data_kepegawaian_prod',
    host: process.env.DB_HOST_PROD || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
}
