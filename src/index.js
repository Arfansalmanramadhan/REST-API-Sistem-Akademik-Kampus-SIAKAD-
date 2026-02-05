require('dotenv').config();
const express = require(`express`)
const ConnectDB = require(`./servers/db`)
const authRouter = require(`./routers/autohRouter`)
const adminRouter = require(`./routers/adminRouter`)
const dosenRouter = require(`./routers/dosenRouter`)
const mahasiswaRouter = require(`./routers/mahasiswaRouter`)
const app = express()

ConnectDB()

app.use(express.json())
app.use(`/api/auth`, authRouter)
app.use(`/api/admin`, adminRouter)
app.use(`/api/dosen`, dosenRouter)
app.use(`/api/mahasiswa`, mahasiswaRouter)
app.listen(3000, () =>{
    console.log('Srver is running on http://localhost:3000')
})