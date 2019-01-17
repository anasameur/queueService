const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../.config.json');

// Get all util function
const { logger } = require('../utils');

// creat Mysql database coonection
const mysql = require('../mysql')

// set server params.
const { hostname } = config.server;
const port = process.env.PORT || config.server.port;

/* ************************** */
/*       Express Config       */
/* ************************** */

// creat Express object.
const app = express();
app.set('trust proxy', true);

// use body parser to parse body param
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    if (err) {
        // Catch bodyParser error
        logger.info(`Invalid Request data ${err}`);
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    id: 'Invalid Request',
                    message: `Invalid Request data ${err.message}`,
                },
            })
        );
    } else {
        next();
    }
});

// allow cors
app.use(cors());

// Set route object
const myRouter = express.Router();

// set route variable to be used by app
app.use(myRouter);

// start server
app.listen(port, () => {
    // eslint-disable-next-line
    logger.info(`Server ${hostname} start on port: ${port}`);
});

/* ********************************************************* */

/* ****************************** */
/*           Groups API           */
/* ****************************** */

/* ************************* */
/*     Get list group        */
/* ************************* */

myRouter.route('/api/v1/groups').get(async (req, res) => {
    try {
        var groups = await mysql.getListGroups();
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                groups: groups,
            })
        );
        return;
    } catch (error) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    id: 'Unable to get group list',
                    message: error.message,
                },
            })
        );
        return;
    }

});


/* ************************* */
/*     Get group by id       */
/* ************************* */

myRouter.route('/api/v1/groups/:id').get(async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        try {
            var group = await mysql.getGroup(id);
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    group: group,
                })
            );
            return;
        } catch (error) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    error: {
                        id: 'Unable to get group ',
                        message: error.message,
                    },
                })
            );
            return;
        }
    } catch (error) {
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    message: `Unable to get group with id ${id}`,
                },
            })
        );
        return;
    }
});

/* ************************* */
/*         creat group       */
/* ************************* */

myRouter.route('/api/v1/groups').post(async (req, res) => {
    try {
        const name = req.body.name;
        if (name) {
            try {
                var group = await mysql.createGroup(name);
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.send(
                    JSON.stringify({
                        mesage: 'Group was created successfuly',
                    })
                );
                return;
            } catch (error) {
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send(
                    JSON.stringify({
                        error: {
                            id: 'Unable to create group ',
                            message: error.message,
                        },
                    })
                );
                return;
            }
        }
        else {
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    error: {
                        message: `Request must have a name param and body have to be in x-www-form-urlencoded `,
                    },
                })
            );
            return;
        }
    } catch (error) {
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    message: `Unable to get group name from the request body`,
                },
            })
        );
        return;
    }
});

/* ************************* */
/*        Creat Counter      */
/* ************************* */

myRouter.route('/api/v1/counter/:id_group').post(async (req, res) => {
    try {
        const id_group = parseInt(req.params.id_group);
        try {
            var counter_id = await mysql.createCounter(id_group);
            try {
                var counter = await mysql.getCounter(counter_id);
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.send(
                    JSON.stringify({
                        counter: counter
                    })
                );
                return;
            } catch (error) {
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send(
                    JSON.stringify({
                        error: {
                            id: 'Counter was created successfuly but result couldn\'t be sended',
                            message: error.message,
                        },
                    })
                );
                return;
            }

        } catch (error) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    error: {
                        id: 'Unable to create counter',
                        message: error.message,
                    },
                })
            );
            return;
        }
    } catch (error) {
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    message: `Unable to get group id`,
                },
            })
        );
        return;
    }
});


/* ************************* */
/*          get Counter      */
/* ************************* */

myRouter.route('/api/v1/counter/:id_counter').get(async (req, res) => {
    try {
        const counter_id = parseInt(req.params.id_counter);
        try {
            var counter = await mysql.getCounter(counter_id);
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    counter: counter
                })
            );
            return;
        } catch (error) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    error: {
                        id: 'Unable to get counter',
                        message: error.message,
                    },
                })
            );
            return;
        }
    } catch (error) {
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    message: `Unable to get counter id`,
                },
            })
        );
        return;
    }
});


/* ************************* */
/*      get Counters list    */
/* ************************* */

myRouter.route('/api/v1/counter').get(async (req, res) => {
    try {
        var counters = await mysql.getListCounter();
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                counters: counters
            })
        );
        return;
    } catch (error) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    id: 'Unable to get counters list',
                    message: error.message,
                },
            })
        );
        return;
    }
});


/* ************************* */
/*      get next counter     */
/* ************************* */

myRouter.route('/api/v1/nextcounter/:id_group').get(async (req, res) => {
    try {
        const id_group = parseInt(req.params.id_group);
        var counters = await mysql.getNextCounter(id_group);
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                counters: counters
            })
        );
        return;
    } catch (error) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    id: 'Unable to get next counter',
                    message: error.message,
                },
            })
        );
        return;
    }
});

/* ************************* */
/*     terminate counter     */
/* ************************* */

myRouter.route('/api/v1/terminate/:id_group').post(async (req, res) => {
    try {
        const id_group = parseInt(req.params.id_group);
        const counter = req.body.counter;

        var counters = await mysql.terminateCounter(id_group,counter);
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                message: `The counter ${counter} in group ${id_group} was terminated successfully`
            })
        );
        return;
    } catch (error) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    message: error.message ,
                },
            })
        );
        return;
    }
});