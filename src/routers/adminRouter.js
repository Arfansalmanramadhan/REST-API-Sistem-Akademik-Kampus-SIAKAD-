const express = require(`express`);
const {postDosen, getDosen, putWaliDosen, postKelas, getKelas, postMahasiswa, getMahasiswa, postMataKuliah, getMatakuliah, getNilaiMahasiswa} = require(`../controller/adminController`)
const verifikasiToken =require(`../middleware/authMiddleware`)
const router = express.Router()
const role = verifikasiToken([`admin`])

router.post('/dosen/:username', role, postDosen)
router.get('/dosen/', role, getDosen)
router.put('/dosen/wali-dosen/:nip', role, putWaliDosen)
router.post('/kelas', role, postKelas)
router.get('/kelas', role, getKelas)
router.post('/mahasiswa/:username', role, postMahasiswa)
router.get('/mahasiswa', role, getMahasiswa)
router.post('/mata-kuliah', role, postMataKuliah)
router.get('/mata-kuliah', role, getMatakuliah)
router.get('/nilai-mahasiswa', role, getNilaiMahasiswa)

module.exports = router;