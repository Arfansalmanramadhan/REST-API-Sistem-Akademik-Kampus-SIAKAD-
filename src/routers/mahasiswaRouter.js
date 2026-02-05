const express = require(`express`)
const {getMahasiswaProfil, putMahasiswaProfil, postKrsMahasiswa, getKrsApprovedMahasiswa, getNilaiMahasiswa} = require(`../controller/mahasiswaController`)
const verifikasiToken = require(`../middleware/authMiddleware`)
const router = express.Router()
const role = verifikasiToken([`mahasiswa`])

router.get(`/profil/`, role, getMahasiswaProfil)
router.put(`/profil/`, role, putMahasiswaProfil)
router.post(`/KRS/`, role, postKrsMahasiswa)
router.get(`/KRS/approved`, role, getKrsApprovedMahasiswa)
router.get(`/Nilai`, role, getNilaiMahasiswa)

module.exports = router