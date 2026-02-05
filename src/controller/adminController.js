const express = require(`express`)
const User = require(`../models/user`)
const Dosen = require(`../models/dosen`)
const Kelas = require(`../models/kelas`)
const Mahasiswa = require(`../models/mahasiswa`)
const Matakul = require(`../models/mataKuliah`)
const Nilai = require(`../models/nilai`)
const response = require(`../utility/response`)


const postDosen = async (req, res) =>{
    try {
        const {username} = req.params
        const {nip, nama} = req.body
        const user = await User.findOne({ username })
        if (!user) return response(404, null, 'user tidak ditemukan', res)
        
        if (user.role !== 'dosen')  return response(400, null, 'user bukan dosen', res)
        
        const dosen = await Dosen.findOneAndUpdate(
            {user: user._id},
            {
                nip,
                nama,   
                subrole: "dosen"
            },
            {
                new:true, 
                runValidators: true,
                upsert: true 
            }
        ).populate('user', 'username role')
        const hasil = {
                username: dosen.user.username,
                nip: dosen.nip,
                nama: dosen.nama,
                subrole: dosen.subrole
            }
        if (!dosen) return response(400, null, 'dosen tidak di temukkan ', res)
        response(200, hasil, 'data dosen berhasil update', res)
    } catch (err) {
        response(500, null, err.message, res)
    }

}
const getDosen = async (req, res) =>{
    try {
        const dosen = await Dosen.find()
            .populate('user', 'username role')
        const hasil = dosen.map(h => ({
            username: h.user.username,
            nip: h.nip,
            nama: h.nama,
            subrole: h.subrole
        }))         
        if (dosen.length === 0) return response(400, [], 'data dosen kosong', res)
            response(200, hasil, 'data dosen', res)
    } catch (err) {
        response(500, null, err.message, res)
    }

}
const putWaliDosen = async (req, res) =>{
    try {
        const {nip} = req.params
        const {subrole} = req.body
        
        const dosen = await Dosen.findOneAndUpdate(
            {nip: nip},
            {subrole },
            {
                new:true, 
                runValidators: true,
            }
        ).populate('user', 'username role')
        if (!dosen) return response(400, null, 'NIP tidak di temukkan ', res)
            const hasil = {
                username: dosen.user.username,
                nip: dosen.nip,
                nama: dosen.nama,
                subrole: dosen.subrole
            }
        response(200, hasil, 'data wali dosen berhasil diupdate', res)
    } catch (err) {
        response(500, null, err.message, res)
    }

}
const postKelas = async (req, res) => {
    try {
        const kelas = await Kelas.create(req.body)
        const hasil = {
            Kelas: kelas.nama_kelas,
            Angkatan: kelas.angkatan
        }
        response(200, hasil, `data  kelas berhasil masuk`, res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const getKelas =  async (req, res) => {
    try {
        const kelas = await Kelas.find()
        const hasil = kelas.map(h => ({
            Kelas: h.nama_kelas,
            Angkatan: h.angkatan
        }))           
        if (hasil.length === 0) return response(400, null, 'data kelas kosong', res)
        response(200, hasil, 'data kelas', res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const postMahasiswa = async (req, res) => {
    try {
        const { username } = req.params; 
        const {nama, nim, nama_kelas, dosen, } = req.body;
        const userMahasiswa = await User.findOne({username})
        if (!userMahasiswa) return response(404, null, 'user tidak ditemukan', res)
        
        if (userMahasiswa.role !== 'mahasiswa')  return response(400, null, 'user bukan mahasiswa', res)

        const kelas = await Kelas.findOne({nama_kelas})

        if(!kelas) return response(401, null, `kelas tidak ditemukan`, res)
        
        const userDosen = await User.findOne({username: dosen})

        if(!userDosen) return response(404, null, `user dosen tidak ditemukan`, res)

        if(userDosen.role !== `dosen`) return response(400, null, `user bukan dosen`, res)

        const waliDosen = await Dosen.findOne({
            user: userDosen._id,
            subrole : "Wali dosen"
        })
        
        if(!waliDosen) return response(400, null, `dosen bukan wali dosen`, res)
        const mahasiswa = await Mahasiswa.findOneAndUpdate(
            {user: userMahasiswa._id},
            {
                nama,
                nim,
                kelas: kelas._id,
                wali_dosen: waliDosen._id
            },
            {
                new: true,
                upsert: true,
            }
        )
        .populate('user', 'username role')
        .populate('kelas', 'nama_kelas angkatan')
        .populate({
            path: 'wali_dosen',
            select: 'nama nip subrole',
            populate: {
                path: 'user',
                select: 'username'
            }
        })
        const hasil = {
            username: mahasiswa.user.username,
            nama: mahasiswa.nama,
            nim: mahasiswa.nim,
            kelas: mahasiswa.kelas.nama_kelas,
            dosen: mahasiswa.wali_dosen.nama,
            walidosen: mahasiswa.wali_dosen.subrole

        }
        response(200, hasil, 'data mahasiswa berhasil disimpan', res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const getMahasiswa = async (req,res) => {
    try {
        const mahasiswa = await Mahasiswa.find()
            .populate('user', 'username role')
            .populate('kelas', 'nama_kelas angkatan')
            .populate({
                path: 'wali_dosen',
                select: 'nama nip subrole',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
        const hasil = mahasiswa.map(h => ({
            username: h.user.username,
            nama: h.nama,
            nim: h.nim,
            kelas: h.kelas.nama_kelas,
            dosen: h.wali_dosen.nama,
            walidosen: h.wali_dosen.subrole,
            Angkatan: h.kelas.angkatan,
        })) 
        if (mahasiswa.length === 0) return response(400, [], 'data mahasiswa kosong', res)
            response(200, hasil, 'data mahasiswa', res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
const postMataKuliah = async (req, res) => {
    try{
        const {kode, nama_matakuliah, sks, nama} = req.body;
        const DosenMataKuliah = await Dosen.findOne({nama})

        if(!DosenMataKuliah) return response(404, null, `Dosen tidak ditemukan`, res)
        const matakul = await Matakul.findOneAndUpdate(
            { kode },
            {
                kode,
                nama_matakuliah,
                sks,
                dosen:DosenMataKuliah._id
            },
            {
                new: true,
                upsert: true,
            }
        )
        .populate('dosen', 'nama')
        const hasil = {
            kode:matakul.kode,
            nama_matakuliah:matakul.nama_matakuliah,
            sks:matakul.sks,
            dosen:matakul.dosen.nama,
        }
        response(200, hasil, `data matakuliah berhasil disimpan`, res)
    } catch (err) {
        response(500, null, err.message, res)
    }
}
const getMatakuliah = async (req, res) =>{
    try {
        const mataKuliah = await Matakul.find()
        .populate('dosen', 'nama')
        const hasil = mataKuliah.map(h => ({
            kode: h.kode,
            nama_Mata_kuliah: h.nama_matakuliah,
            sks: h.sks,
            dosen: h.dosen.nama
        }))
        if(mataKuliah.length === 0) response(400, null, `data mata kuliah kosong`, res)

        response(200, hasil, `data mata kuliah`, res)
    } catch(err) {
        response(500, null, err.message, res)

    }
}
const getNilaiMahasiswa = async (req,res) => {
    try {
        
        const nilaiMahasiswa = await Nilai.find()
        .populate(`mahasiswa`, `nama`)
        .populate(`matakuliah`, `nama_matakuliah sks `)
        const hasil = nilaiMahasiswa.map(h => ({
            nama: h.mahasiswa.nama,
            mataKuliah: h.matakuliah.nama_matakuliah,
            SKS: h.matakuliah.sks,
            nilai:h.nilai,
            ipk:h.ipk
        }))
        if (!nilaiMahasiswa) return response(400, null, 'nilai tidak di temukkan ', res)
        response(200, hasil, `Lihat nilai mahasiswa`, res)
    } catch(err) {
        response(500, null, err.message, res)
    }
}
module.exports = {
    postDosen,
    getDosen,
    putWaliDosen,
    postKelas,
    getKelas,
    postMahasiswa,
    getMahasiswa,
    postMataKuliah,
    getMatakuliah,
    getNilaiMahasiswa
}  