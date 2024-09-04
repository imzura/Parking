import express from 'express';
import 'dotenv/config' // permite trabajar con variables de entorno
import dbConnection from '../database/config.js';
import routesCell from '../routes/routescell.js';

export default class Server {
    constructor() {
        this.app = express()
        this.listen()
        this.dbConnection()
        this.pathCell = '/api/cell'
        this.route()
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running in PORT ${process.env.PORT}`)
        })
    }

    async dbConnection() {
        await dbConnection()
    }

    route() {
        this.app.use(express.json());

        // Routes
        this.app.use(this.pathCell, routesCell)
    }
}
