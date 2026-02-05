const express = require(`express`)
const {putDosen, getDosenProdil, getDosenMatakuliah, getMahasiswaAll, getMahasiswaMataKuliah, getWalidosenMahasiswaAll, getWalidosenMahasiswaPending, postWalidosenMahasiswaPendiing, postNilaiMahasiswa, putNilaiMahasiswa, getNilaiMahasiswa} = require(`../controller/dosenContorller`)
const verifikasiToken = require(`../middleware/authMiddleware`)
const router = express.Router()
const role = verifikasiToken([`dosen`])

router.put(`/profil/`, role, putDosen)
router.get(`/profil/`, role, getDosenProdil)
router.get(`/mata-kuliah`, role, getDosenMatakuliah)
router.get(`/mahasiswa`, role, getMahasiswaAll)
router.get(`/mata-kuliah/:nim`, role, getMahasiswaMataKuliah)
router.get(`/wali/mahasiswa`, role, getWalidosenMahasiswaAll)
router.get(`/wali/KRS/:nim`, role, getWalidosenMahasiswaPending)
router.post(`/wali/KRS/:nim`, role, postWalidosenMahasiswaPendiing)
router.post(`/nilai/`, role, postNilaiMahasiswa)
router.put(`/nilai/:nim`, role, putNilaiMahasiswa)
router.get(`/nilai/`, role, getNilaiMahasiswa)

module.exports = router;        