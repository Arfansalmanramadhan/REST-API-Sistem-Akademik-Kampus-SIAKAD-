const mongoose= require(`mongoose`)

const MataKuliahSchema = mongoose.Schema({
    kode: {
        type:String,
        required:true,
        unique:true
    },
    nama_matakuliah: {
        type:String,
        required:true
    },
    sks: {
        type:String,
        required:true
    },
    dosen: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Dosen'
    }
}, {timestamps: true})
module.exports = mongoose.model(`MataKuliah`, MataKuliahSchema)