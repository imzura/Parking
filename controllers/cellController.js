import Cell from "../models/cell.js"
import bcrypt from 'bcryptjs'

export async function createCell(req, res) {
    const body = req.body;
    try {
        const countCells = await Cell.countDocuments();
        if (countCells >= 10) {
            return res.status(400).json('Limit reached');
        }
        const cell = new Cell(body)
        await cell.save()
        res.status(201).json('Cell created successfully');
    } catch (error) {
        res.status(500).json('Error creating cell');
    }
}

export async function getCellForId(req, res) {
    try {
        const cell = await Cell.findById(req.params.id)
        if (!cell) {
            res.status(404).json('Cell not found')
        } else {
            res.json(cell)
        }
    } catch (error) {

    }
}

export async function getCells(req, res) {
    try {
        const cells = await Cell.find();
        res.json(cells)
    } catch (error) {
        res.status(400).json('Error');
    }
}

export async function getCellForStatus(req, res) {
    try {
        const cells = await Cell.find({ status: 'disponible' })
        res.json(cells)
    } catch (error) {
        res.status(400).json('No cells available');
    }
}

export async function updateCell(req, res) {
    try {
        const cell = await Cell.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        if (!cell) {
            return res.status(404).json('Cell not found')
        } else {
            res.status(201).json('Cell updated successfully')
        }
    } catch (error) {
        res.status(400).json('Cell not updated');
    }
}

export async function deleteCell(req, res) {
    try {
        const cell = await Cell.findByIdAndDelete(req.params.id);
        if (!cell) {
            return res.status(404).json('Cell not found')
        } else {
            res.status(201).json('Cell deleted successfully');
        }
    } catch (error) {
        res.status(400).json('Cell not deleted');
    }
};

export async function parkVehicle(req, res) {
    const { plateVehicle } = req.body
    try {
        const availableCell = await Cell.findOne({ status: 'disponible' });
        if (!availableCell) {
            return res.status(404).json('No available cells');
        }
        availableCell.plateVehicle = plateVehicle;
        availableCell.status = 'no disponible';
        availableCell.entryDate = new Date();
        availableCell.exitDate = '';

        const pinGenerator = `${availableCell.cellNumber}${plateVehicle}`;
        availableCell.pin = await bcrypt.hash(pinGenerator, 10);

        await availableCell.save();
        res.status(201).json('Vehicle parked successfully');
    } catch (error) {
        res.status(404).json('Vehicle not parked');
    }
}

export async function exitVehicle(req, res) {
    const id = req.params.id
    try {
        const cell = await Cell.findById(id)
        if (!cell || cell.status === 'disponible') {
            return res.status(404).json('Cell not found')
        }

        cell.status = 'disponible';
        cell.plateVehicle = '';
        cell.entryDate = '';
        cell.exitDate = new Date();
        cell.pin = '';

        await cell.save();
        res.status(201).json('Vehicle exited successfully');
    } catch (error) {
        res.status(404).json('Vehicle not exited');
    }
}

export async function valuePay(req, res) {
    const id = req.params.id;
    try {
        const cell = await Cell.findById(id);
        if (!cell || cell.status === 'disponible') {
            return res.status(404).json('Cell not found');
        }

        const entryDate = new Date(cell.entryDate);
        const exitDate = new Date(cell.exitDate);
        
        const diffMilliseconds = exitDate - entryDate;
        const hours = diffMilliseconds / (1000 * 60 * 60);
        
        let valueHours;
        if (hours < 1) {
            valueHours = 5000;
        } else {
            valueHours = hours * 5000;
        }

        res.status(201).json(valueHours);
    } catch (error) {
        res.status(404).json('Error in calculating payment value');
    }
}