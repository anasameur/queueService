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

/**************************************/
/*           get Counter by id        */
/**************************************/

function getCounter(id_couter) {
  return new Promise((resolve, reject) => {
    dbconnection.query('select * from queue.counters where ID_COUNTER = ? ', [id_couter], function (error, results, fields) {
      if (error) {
        reject(error)
      };
      resolve(results[0])
    });
  })
}


/**************************************/
/*           get Counter list         */
/**************************************/

function getListCounter() {
  return new Promise((resolve, reject) => {
    dbconnection.query('select * from queue.counters', function (error, results, fields) {
      if (error) {
        reject(error)
      };
      resolve(results)
    });
  })
}

/**************************************/
/*            Create Counter          */
/**************************************/

function createCounter(id_groups) {
  return new Promise((resolve, reject) => {
    var counter = null;
    dbconnection.query('select max(counter) as max_counter from queue.counters where GROUP_ID = ?', [id_groups], function (error, results, fields) {
      if (error) {
        reject(error)
      };
      counter = ((results[0].max_counter) ? results[0].max_counter : 0) + 1 ;
      dbconnection.query('insert into queue.counters (GROUP_ID,COUNTER) value (?,?) ', [id_groups, counter], function (error, results, fields) {
        if (error) {
          reject(error)
        };
        resolve(results.insertId)
      });
    });
  })
}


/**************************************/
/*          Get next Counter          */
/**************************************/

function getNextCounter(id_groups) {
  return new Promise((resolve, reject) => {
    var nextCounter = null;
    dbconnection.query('select min(counter) as next_counter from queue.counters where GROUP_ID = ? and STATUS = "WAITING" ', [id_groups], function (error, results, fields) {
      if (error) {
        reject(error)
      };
      nextCounter = results[0].next_counter ;
      resolve(nextCounter)
    });
  })
}


/**************************************/
/*         terminate Counter          */
/**************************************/

function terminateCounter(id_groups,counter) {
  return new Promise((resolve, reject) => {
    dbconnection.query('UPDATE queue.counters SET STATUS = "TERMINATED" WHERE GROUP_ID = ? and COUNTER = ?', [id_groups,counter], function (error, results, fields) {
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
  createGroup: createGroup,
  createCounter: createCounter,
  getCounter: getCounter,
  getListCounter: getListCounter,
  getNextCounter: getNextCounter,
  terminateCounter: terminateCounter
};
