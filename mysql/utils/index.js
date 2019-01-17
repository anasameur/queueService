/**************************************/
/*   Mysql database utils fonctions   */
/**************************************/
function mysqlconnection(initconnection) {
    return new Promise((resolve, reject) => {
        initconnection.connect(function (err) {
            if (err) {
                reject(err);
            }
            resolve(initconnection);
        })
    })
}


module.exports = { mysqlconnection: mysqlconnection };