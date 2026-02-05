const mongoose = require(`mongoose`)

const krsSchema = new mongoose.Schema({
    mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
        required:true
    },
    matakuliah: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MataKuliah',
        required:true
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending',
        required: true
    }
},{timestamps: true})
// 🔒 kombinasi unik (INI YANG BENAR)
// krsSchema.index(
//     { mahasiswa: 1, matakuliah: 1 },
//     { unique: true }
// )

module.exports = mongoose.model('KRS', krsSchema)
