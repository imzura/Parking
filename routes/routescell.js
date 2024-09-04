import { Router } from "express";
import { createCell, getCellForId, getCells, getCellForStatus, updateCell, deleteCell, parkVehicle, exitVehicle, valuePay } from '../controllers/cellController.js';

const routesCell = Router();

routesCell.post('/', createCell)
routesCell.get('/:id', getCellForId)
routesCell.get('/', getCells)
routesCell.get('/status/disponible', getCellForStatus)
routesCell.put('/:id', updateCell)
routesCell.delete('/:id', deleteCell)
routesCell.post('/parkVehicle', parkVehicle)
routesCell.post('/exitVehicle/:id', exitVehicle)
routesCell.get('/valuePay/:id', valuePay)

export default routesCell