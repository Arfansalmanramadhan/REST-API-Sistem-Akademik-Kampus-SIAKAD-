const express = require(`express`)
const Dosen = require(`../models/dosen`)
const Matakul =  require(`../models/mataKuliah`)
const Mahasiswa = require(`../models/mahasiswa`)
const KRS = require(`../models/Krs`)
const Nilai = require(`../models/nilai`)
const response = require(`../utility/response`)


const putDosen = async (req, res) => {
    try {
        const { nama } = req.body
        const dosen = await Dosen.findOneAndUpdate(
            {user: req.user.id},
            {nama},
            {new:true}
        )
        .populate('user', 'username role')
        const hasil = {
                username: dosen.user.username,
                nip: dosen.nip,
                nama: dosen.nama
        }
        if (!dosen) return response(400, null, 'dosen tidak di temukkan ', res)
        response(200, hasil, 'data dosen berhasil update', res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const getDosenProdil = async (req, res) => {
    try {
        const dosen = await Dosen.find({user: req.user.id})
            .populate('user', 'username role')
        const hasil = dosen.map(h => ({
            username: h.user.username,
            nip: h.nip,
            nama: h.nama,
            subrole: h.subrole
        }))         
        if (dosen.length === 0) return response(400, [], 'data dosen kosong', res)
        response(200, hasil, 'profil dosen', res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const getDosenMatakuliah = async (req, res) => {
    try {
        const dosen = await Dosen.findOne({ user: req.user.id })

        if (!dosen) return response(404, null, 'profil dosen tidak ditemukan', res)
        const matkulDiampu = await  Matakul.findOne({dosen: dosen._id})
        if (!matkulDiampu) return response(404, null, 'Mata kuliah tidak ditemukan', res)
        const Krs = await KRS.find(
            { 
                matakuliah: matkulDiampu._id,
                status: "approved"
            }
        )
        .populate(`mahasiswa`,  `nama nim`)
        .populate(`matakuliah`,  `kode nama_matakuliah sks`)
        const hasil = Krs.map(h => ({
            nama: h.mahasiswa.nama,
            nim: h.mahasiswa.nim,
            MataKuliah: h.matakuliah.nama_matakuliah,
            sks: h.matakuliah.sks
        }))
        if(Krs.length === 0) response(400, null, `data mata kuliah kosong`, res)
        response(200, hasil, `data mata kuliah`, res)
    } catch(err) {
        response(600, null, err.message, res)
    }
}
const getMahasiswaAll = async (req,res) => {
    try {
        const dosen = await Dosen.findOne({user: req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)

        const mahasiswaIds = await KRS.distinct("mahasiswa", {
            status: "approved"
        })

        const mahasiswa = await Mahasiswa.find({
            _id: { $in: mahasiswaIds }
        }).select("nama nim")
        const hasil = mahasiswa.map(h => ({
            nama:h.nama,
            nim:h.nim
        }))
        if (mahasiswa.length === 0) return response(400, [], `Data mahasiswa kosong`, res)
        response(200, hasil, `Data mahasiswa`, res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const getMahasiswaMataKuliah = async (req,res) => {
    try {
        const {nim} = req.params
        const dosen = await Dosen.findOne({user: req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)
        const mahasiswaa = await Mahasiswa.findOne({nim})
        if (!mahasiswaa) return response(404, null, 'Mahasiswa tidak ditemukan', res)
        const matakul = await Matakul.findOne({dosen: dosen._id})
        if (!matakul) return response(404, null, 'Mata kuliah  tidak ditemukan', res)
        const Krs = await KRS.find(
            {
                mahasiswa: mahasiswaa._id,    
                matakuliah: matakul._id,
                status: "approved"
            }
        )
        .populate(`mahasiswa`,  `nama nim`)
        .populate(`matakuliah`,  `kode nama_matakuliah sks`)
        const hasil = Krs.map(h => ({
            nama: h.mahasiswa.nama,
            nim: h.mahasiswa.nim,
            MataKuliah: h.matakuliah.nama_matakuliah,
            sks: h.matakuliah.sks,
            // status: h.status,
        }))
        if (Krs.length === 0) return response(200, [], `Belum ada KRS yang disetujui`, res)
        response(200, hasil, `Data KRS approved`, res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const getWalidosenMahasiswaAll = async (req,res) => {
    try {
        const dosen = await Dosen.findOne({user:req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)
        const mahasiswa = await Mahasiswa.find({wali_dosen: dosen._id})
        .populate(`user`, `username`)
        .populate(`kelas`, `nama_kelas`)
        .populate(`wali_dosen`, `nama subrole`)
        if(mahasiswa.length === 0) return response(400, null, `pembimbing mahasiswa anda tidak tersedia `, res)
        const hasil = mahasiswa.map(h =>({
            username: h.user.username,
            nama: h.nama,
            nim: h.nim,
            kelas: h.kelas.nama_kelas,
            waliDosen: h.wali_dosen.nama
        }))
        response(200, hasil, `lihat mahasiswa per kelas`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const getWalidosenMahasiswaPending = async (req,res) => {
    try {
        const {nim} = req.params
        const dosen = await Dosen.findOne({user: req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)
        const mahasiswa = await Mahasiswa.findOne(
            {
                nim: nim,
                wali_dosen: dosen._id
            }
        )
        
        if (!mahasiswa) return response(404, null, 'anda bukan pembibing mahasiswa', res)
        const Krs = await KRS.find(
            {
                mahasiswa: mahasiswa._id,
                status: 'pending'
            }
        )
        .populate(`mahasiswa`,  `nama nim`)
        .populate(`matakuliah`,  `kode nama_matakuliah sks`)
        const hasil = Krs.map(h => ({
            nama: h.mahasiswa.nama,
            nim: h.mahasiswa.nim,
            MataKuliah: h.matakuliah.nama_matakuliah,
            sks: h.matakuliah.sks,
            status: h.status,
        }))
        if (Krs.length === 0) return response(200, [], `KRS sudah di pending`, res)
        response(200, hasil, `Data KRS belum di approved`, res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const postWalidosenMahasiswaPendiing = async (req,res) => {
    try {
        const {nim} = req.params
        const {nama_matakuliah, status} = req.body
        const dosen = await Dosen.findOne({user: req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)
        const namaMatkul = await Matakul.findOne({nama_matakuliah})
        if (!namaMatkul) return response(404, null, ' Mata kuliah tidak ditemukan', res)
        const mahasiswa = await Mahasiswa.findOne(
            {
                nim: nim,
                wali_dosen: dosen._id
            }
        )
        if (!mahasiswa) return response(404, null, 'Anda bukan pembimbing mahasiswa', res)
        const Krs = await KRS.findOneAndUpdate(
            {
                mahasiswa: mahasiswa._id,
                matakuliah: namaMatkul._id
            },
            { status },
            { new: true }
        )
        .populate(`mahasiswa`,  `nama nim`)
        .populate(`matakuliah`,  `kode nama_matakuliah sks`)
        const hasil = {
            nama: Krs.mahasiswa.nama,
            nim: Krs.mahasiswa.nim,
            MataKuliah: Krs.matakuliah.nama_matakuliah,
            sks: Krs.matakuliah.sks,
            status: Krs.status,
        }
        if (!Krs) return response(400, null, `KRS sudah di approved`, res)
        response(200, hasil, `KRS berhasil di approved`, res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const postNilaiMahasiswa = async (req,res) => {
    try {
        const {nilai, ipk, nama, nama_matakuliah} = req.body
        const dosen = await Dosen.findOne({user: req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)
        const userMahasiswa = await Mahasiswa.findOne({nama})
        if(!userMahasiswa) return response(400, null, `Mahasiswa tidak ditemukan`, res)
        const matkul = await Matakul.findOne({nama_matakuliah})
        if(!matkul) return response(400, null, `Mata kuliah  tidak ditemukan`, res)
        
        const nilaiMahasiswa = await Nilai.findOneAndUpdate(
            {
                mahasiswa: userMahasiswa._id,
                matakuliah: matkul._id
            },
            {
                nilai,
                ipk
            },
            {
                new: true,
                upsert: true,
            }
        )
        .populate(`mahasiswa`, `nama`)
        .populate(`matakuliah`, `nama_matakuliah sks `)
        const hasil = {
            nama: nilaiMahasiswa.mahasiswa.nama,
            mataKuliah: nilaiMahasiswa.matakuliah.nama_matakuliah,
            SKS: nilaiMahasiswa.matakuliah.sks,
            nilai:nilaiMahasiswa.nilai,
            ipk:nilaiMahasiswa.ipk
        }
        if (!nilaiMahasiswa) return response(400, null, 'nilai tidak di temukkan ', res)
        response(200, hasil, `Nilai berhasil`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const putNilaiMahasiswa = async (req,res) => {
    try {
        const {nim} = req.params
        const {nilai, ipk, nama, nama_matakuliah} = req.body
        const dosen = await Dosen.findOne({user: req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)
        const userMahasiswa = await Mahasiswa.findOne({nim},{nama})
        if(!userMahasiswa) return response(400, null, `Mahasiswa tidak ditemukan`, res)
        const matkul = await Matakul.findOne({nama_matakuliah})
        if(!matkul) return response(400, null, `Mata kuliah  tidak ditemukan`, res)
        
        const nilaiMahasiswa = await Nilai.findOneAndUpdate(
            {
                mahasiswa: userMahasiswa._id,
                matakuliah: matkul._id
            },
            {
                nilai,
                ipk
            },
            {
                new: true,
            }
        )
        .populate(`mahasiswa`, `nama`)
        .populate(`matakuliah`, `nama_matakuliah sks `)
        const hasil = {
            nama: nilaiMahasiswa.mahasiswa.nama,
            mataKuliah: nilaiMahasiswa.matakuliah.nama_matakuliah,
            SKS: nilaiMahasiswa.matakuliah.sks,
            nilai:nilaiMahasiswa.nilai,
            ipk:nilaiMahasiswa.ipk
        }
        if (!nilaiMahasiswa) return response(400, null, 'nilai tidak di temukkan ', res)
        response(200, hasil, `Nilai berhasil`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const getNilaiMahasiswa = async (req,res) => {
    try {
        const dosen = await Dosen.findOne({user: req.user.id})
        if (!dosen) return response(404, null, ' dosen tidak ditemukan', res)
            
        const matkulDiampu = await Matakul.find({ dosen: dosen._id })
        
        const nilaiMahasiswa = await Nilai.find({
            matakuliah: matkulDiampu  
        })
        .populate(`mahasiswa`, `nama`)
        .populate(`matakuliah`, `nama_matakuliah sks `)
        if (nilaiMahasiswa.length === 0) return response(200, null, 'Dosen belum mengampu mata kuliah', res)
        const hasil = nilaiMahasiswa.map(h => ({
            nama: h.mahasiswa.nama,
            mataKuliah: h.matakuliah.nama_matakuliah,
            SKS: h.matakuliah.sks,
            nilai:h.nilai,
            ipk:h.ipk
        }))
        response(200, hasil, `Lihat nilai mahasiswa`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
module.exports = {
    putDosen,
    getDosenProdil,
    getDosenMatakuliah,
    getMahasiswaAll,
    getMahasiswaMataKuliah,
    getWalidosenMahasiswaAll,
    getWalidosenMahasiswaPending,
    postWalidosenMahasiswaPendiing,
    postNilaiMahasiswa,
    putNilaiMahasiswa,
    getNilaiMahasiswa
}