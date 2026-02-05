const mongoose = require(`mongoose`)

const MahasiswaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        unique: true
    },
    nama:{
        type:String,
        unique: true,
        required:true
    },
    nim:{
        type:Number,
        unique: true,
        required:true
    },
    kelas: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Kelas`
    },
    wali_dosen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Dosen`
    }
},{timestamps: true})
module.exports = mongoose.model(`Mahasiswa`, MahasiswaSchema)