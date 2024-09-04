import mongoose, { model, Schema } from "mongoose";
import autoIncrement from 'mongoose-sequence'
import bcrypt from 'bcryptjs'

const AutoIncrement = autoIncrement(mongoose) 

const CellSchema = new Schema({
    cellNumber: {
        type: Number,
        require: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['available', 'no available'],
        default: 'available'
    },
    plateVehicle: {
        type: String,
        maxlength: [6, 'Max 6 caracters']
    },
    entryDate: {
        type: Date,
        default: ''
    },
    exitDate: {
        type: Date,
        default: ''
    },
    pin: {
        type: String,
        default: ''
    }

})

CellSchema.plugin(AutoIncrement, {
    inc_field: 'cellNumber',
    start_seq: 1
})

// Middleware para autoincrementar numeroCelda
CellSchema.pre('save', async function (next) {
    // Generar el pin si hay una placaVehiculo
    if (this.plateVehicle) {
        const pinGenerator = `${this.cellNumber}${this.plateVehicle}`;
        this.pin = await bcrypt.hash(pinGenerator, 10);
    }
    next();
});

export default model('Cell', CellSchema, 'cell')