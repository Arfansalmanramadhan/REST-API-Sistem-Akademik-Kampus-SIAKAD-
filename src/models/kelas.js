const mongoose = require(`mongoose`)

const KelasSchema = new mongoose.Schema({
    nama_kelas: {
        type:String,
        required:true,
    },
    angkatan: {
        type:String,
        required:true
    },
},{timestamps: true})
module.exports = mongoose.model(`Kelas`, KelasSchema)
