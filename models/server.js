const express = require('express');
const cors = require('cors');
const apiRoutes = require('../routes/app.routers');

class Server {
    constructor () {
        this.app = express();
        this.port = process.env.PORT;
        this.apiPath = '/api';

        this.middleWares();
        this.routes();
    }

    middleWares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static('public'));
        this.app.use(cors());
    }

    routes() {
        this.app.use(this.apiPath, apiRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = Server;