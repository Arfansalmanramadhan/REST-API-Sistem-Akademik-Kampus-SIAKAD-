const mongoose = require(`mongoose`)

const DosenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        unique: true
    },
    nip: {
        type: String,
        unique: true,
        required:true   
    },
    nama: {
        type: String,
        unique: true,
        required:true
    },
    subrole: {
        type:String,
        enum : [`dosen`, `Wali dosen`],
        default: `dosen`
    }
},{timestamps: true})

module.exports = mongoose.model(`Dosen`, DosenSchema)