const express = require(`express`)
const Mahasiswa = require(`../models/mahasiswa`)
const Matakul = require(`../models/mataKuliah`)
const KRS = require(`../models/Krs`)
const Nilai = require(`../models/nilai`)
const Dosen = require(`../models/dosen`)
const response = require(`../utility/response`)

const getMahasiswaProfil = async (req, res) => {
    try {
        const mahasiswa = await Mahasiswa.find({user: req.user.id})
            .populate(`user`, `username role`)
            .populate(`kelas`, `nama_kelas angkatan`)
            .populate(`wali_dosen`, `nama subrole`)
        const hasil = mahasiswa.map(h => ({
            username: h.user.username,
            nama: h.nama,
            nim: h.nim,
            kelas: h.kelas.nama_kelas,
            Angkaran: h.kelas.angakatan,
            dosen: h.wali_dosen.nama,
            wali: h.wali_dosen.subrole,
        }))
        if (mahasiswa.length === 0) return response(400, [], `data mahasiwa kosong`, res)
        response(200, hasil, `profil mahasiswa`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const putMahasiswaProfil = async (req, res) => {
    try {
        const {nama} = req.body
        const mahasiswa = await Mahasiswa.findOneAndUpdate(
            {user: req.user.id},
            {nama},
            {new:true}
        )
        .populate(`user`, `username role`)
        .populate(`kelas`, `nama_kelas angkatan`)
        .populate(`wali_dosen`, `nama subrole`)
        const hasil = {
            username: mahasiswa.user.username,
            nama: mahasiswa.nama,
            nim: mahasiswa.nim,
            kelas: mahasiswa.kelas.nama_kelas,
            Angkaran: mahasiswa.kelas.angakatan,
            dosen: mahasiswa.wali_dosen.nama,
            wali: mahasiswa.wali_dosen.subrole,
        }
        if (!mahasiswa) return response(400, [], `mahasiswa tidak ditemukan`, res)
            response(200, hasil, `profil mahasiswa berhasi update`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const postKrsMahasiswa = async (req, res) => {
    try {
        const {nama_matakuliah} = req.body
        const mahasiswa = await Mahasiswa.findOne({user: req.user.id})
        const namaMataKuliah = await Matakul.findOne({nama_matakuliah})
        if(!namaMataKuliah) return response(400, null, `Mata kuliah tidak ditemukan`, res)
        const Krs = await KRS.findOneAndUpdate(
            {
                mahasiswa: mahasiswa._id,
                matakuliah:namaMataKuliah._id
            },
            {
                status: 'pending' 
            },
            {
                new: true,
                upsert: true,
                // runValidators: true
            }
        )
        .populate(`mahasiswa`,  `nama`)
        .populate(`matakuliah`,  `kode nama_matakuliah krs`)
        const hasil = {
            nama: Krs.mahasiswa.nama,
            kode: Krs.matakuliah.kode,
            MataKuliah: Krs.matakuliah.nama_matakuliah,
            sks: Krs.matakuliah.sks,
            status: Krs.status,
        }
        response(200, hasil, 'data mata mahasiswa berhasil disimpan', res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const getKrsApprovedMahasiswa  = async (req, res) => {
    try{
        const mahasiswa = await Mahasiswa.findOne({user: req.user.id})
        if(!mahasiswa) return response(400, [], `Mahasiswa tidak ditemukan`, res)
            const Krs = await KRS.find({
                mahasiswa: mahasiswa._id,
                status: 'approved'
            })
        .populate(`mahasiswa`,  `nama`)
        .populate(`matakuliah`,  `kode nama_matakuliah sks`)
        const hasil = Krs.map(h => ({
            nama: h.mahasiswa.nama,
            kode: h.matakuliah.kode,
            MataKuliah: h.matakuliah.nama_matakuliah,
            sks: h.matakuliah.sks,
            status: h.status,
        }))
        if (Krs.length === 0) return response(200, [], `Belum ada KRS yang disetujui`, res)
            response(200, hasil, `Data KRS approved`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
    // const getNilai = 
}
const getNilaiMahasiswa = async (req,res) => {
    try {
        const mahasiswaa = await Mahasiswa.findOne({user: req.user.id})
        if (!mahasiswaa) return response(404, null, ' mahasiswa tidak ditemukan', res)

            const nilaiMahasiswa = await Nilai.find(
            {
                mahasiswa:mahasiswaa._id
            }
        )
        .populate(`mahasiswa`, `nama`)
        .populate(`matakuliah`, `nama_matakuliah sks `)
        const hasil = nilaiMahasiswa.map(h => ({
            nama: h.mahasiswa.nama,
            mataKuliah: h.matakuliah.nama_matakuliah,
            SKS: h.matakuliah.sks,
            nilai:h.nilai,
            ipk:h.ipk
        }))
        if (nilaiMahasiswa.length === 0) return response(200, [], 'Dosen belum kasih nilai ', res)
        response(200, hasil, `Lihat nilai mahasiswa`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}   
module.exports ={
    getMahasiswaProfil,
    putMahasiswaProfil,
    postKrsMahasiswa,
    getKrsApprovedMahasiswa,
    getNilaiMahasiswa
}