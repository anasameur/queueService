const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../.config.json');

// Get all util function
  const { logger } = require('../utils');

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
        // eslint-disable-next-line
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
/*         Requests API           */
/* ****************************** */

myRouter.route('/api/v1/groups').get(async (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(
        JSON.stringify({
            groups: {
                id: '1',
                name: 'Service1',
            },
        })
    );
    return;
});
