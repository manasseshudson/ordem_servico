require('dotenv').config();
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    //host : '148.113.153.60',
    host : '168.75.108.235',
    port : 3306,
    user: 'ordem_servico',
    password : 'qwer0987',
    database : 'ordem_servico'
  }
});
module.exports = knex;

  