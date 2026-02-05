const mongoose = require(`mongoose`)

const nilaiSchema = new mongoose.Schema({
    mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
        required: true
    },
    matakuliah: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MataKuliah',
        required: true
    },
    nilai: {
        type: String,
        // required: true
    },
    ipk: {
        type: String,
        // required: true
    }
},{timestamps: true})   
module.exports = mongoose.model('Nilai', nilaiSchema)
