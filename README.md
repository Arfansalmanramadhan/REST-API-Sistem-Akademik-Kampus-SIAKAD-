# 🎓 REST API Sistem Akademik Kampus (SIAKAD)

REST API Sistem Informasi Akademik Kampus (SIAKAD) yang dirancang untuk menangani proses akademik kampus secara terstruktur, aman, dan scalable dengan pendekatan real-world academic workflow.

---

## Teknologi yang Digunakan

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Role-Based Access Control (RBAC)

---




## Struktur Folder

```
src/
├── controller/
│ ├── adminController.js
│ ├── authController.js
│ ├── dosenController.js
│ └── mahasiswaController.js
│
├── middleware/
│ └── authMiddleware.js
│
├── models/
│ ├── user.js
│ ├── mahasiswa.js
│ ├── dosen.js
│ ├── mataKuliah.js
│ ├── kelas.js
│ ├── krs.js
│ └── nilai.js
│
├── routers/
│ ├── adminRouter.js
│ ├── authRouter.js
│ ├── dosenRouter.js
│ └── mahasiswaRouter.js
│
├── servers/
│ ├── db.js
│ └── jwtkey.js
│
├── utility/
│ └── response.js
│
├── index.js

```



## 🧩 Deskripsi Modul

### 🔐 Authentication & Authorization
- JWT Authentication
- Token-based security
- Role-Based Access Control (RBAC)
- Middleware otorisasi per role

---

### 🧑‍💼 Kaprodi (Admin Akademik)
Fitur utama:
- Mengelola data mahasiswa (lihat, verifikasi)
- Mengelola data dosen
- Menentukan wali dosen mahasiswa
- Generate & assign NIM
- Mengelola mata kuliah

✔ Mencerminkan proses nyata sistem akademik kampus

---

### 👨‍🏫 Dosen
Fitur dosen:
- Mengampu mata kuliah
- Melihat daftar mahasiswa per mata kuliah
- Input & update nilai mahasiswa

---

### 👨‍🏫 Wali Dosen
Fitur pembimbing akademik:
- Melihat data mahasiswa bimbingan
- Verifikasi KRS mahasiswa
- Monitoring nilai akademik mahasiswa

---

### 🎓 Mahasiswa
Fitur mahasiswa:
- Registrasi & login
- Pengambilan mata kuliah (KRS)
- Melihat nilai akademik

---

## ⚙️ Instalasi & Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone https://github.com/Arfansalmanramadhan/REST-API-Sistem-Akademik-Kampus-SIAKAD-
cd REST-API-Sistem-Akademik-Kampus-SIAKAD-
```
## Instalasi

### 2. Install Dependency

```baesh
npm install
```

### 3. Jalankan Server

```bash
npm run dev

```

### 4. Pastikan MongoDB Berjalan

Pastikan service MongoDB sudah berjalan di:

```
mongodb://127.0.0.1/
```

### 5. Jalankan Server

```bash
npm run dev
```

### 6. Server akan berjalan di:

```
http://localhost:3000
```

---

## Authentication & Authorization

```makefile
Authorization: Bearer <token>

```






## Author

**Arfan Salman Ramadhan**
Backend Developer | Node.js | Express.js | MongoDB | REST API




