const mysql = require('mysql');
const config = require('../.config.json');
const { logger } = require('../utils');
const { mysqlconnection } = require('./utils');

/**************************************/
/*       Mysql database config       */
/**************************************/

const dbconfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
};

/**************************************/
/*   Return an Mysql db connection    */
/**************************************/

// Creat a Mysql db connection
var dbconnection = null;

(async function openConnection() {
  try {
    initconnection = mysql.createConnection(dbconfig);
    dbconnection = await mysqlconnection(initconnection)
    logger.info(`Connection with Mysql db created succesfuly`);
    logger.info(`connected as id ${dbconnection.threadId}`);
  } catch (error) {
    logger.error(
      `Error on openning connection with Mysql db ${error.stack}`
    );
  }
})();


/**************************************/
/*           Get list of groups       */
/**************************************/

function getListGroups() {
  return new Promise((resolve, reject) => {
    dbconnection.query('SELECT * from queue.groups', function (error, results, fields) {
      if (error) {
        reject(error)
      };
      resolve(results)
    });

  })
}

/**************************************/
/*               Get groups           */
/**************************************/

function getGroup(id_groups) {
  return new Promise((resolve, reject) => {
    dbconnection.query('SELECT * from queue.groups where ID_GROUPS = ?', [id_groups], function (error, results, fields) {
      if (error) {
        reject(error)
      };
      resolve(results[0])
    });
  })
}

/**************************************/
/*            Create groups           */
/**************************************/

function createGroup(name_groups) {
  return new Promise((resolve, reject) => {
    dbconnection.query('insert into queue.groups (name) value (?) ', [name_groups], function (error, results, fields) {
      if (error) {
        reject(error)
      };
      resolve()
    });
  })
}


/**********************************************/
/* Closing database connection on Process SIG */
/**********************************************/

process
  .on('SIGTERM', function () {
    logger.info('Closing db connection');
    dbconnection.destroy()()
    setTimeout(function () { process.exit(0); }, 1000);
  })
  .on('SIGINT', function () {
    logger.info('Closing db connection');
    dbconnection.destroy()
    setTimeout(function () { process.exit(0); }, 1000);
  });


module.exports = {
  getListGroups: getListGroups,
  getGroup: getGroup,
  createGroup: createGroup
};
