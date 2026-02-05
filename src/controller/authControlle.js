const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)
const User = require(`../models/user`)
const response = require(`../utility/response`)
const  PRIVATE_KEY   =require(`../servers/jwtkey`)

const register = async (req,res) => {
    try {
        const {email, username, password, role} = req.body
        if (!email || !username || !password) return response(400, null, 'Data tidak lengkap', res);
        // const passwordHash = await bcrypt.hash(password, 10);
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({email, username, password: passwordHash, role})
        await user.save()
        const users = {
            id: user._id,
            email,
            username,
            role
        }
        response(200, users, `Pengguna yang terdaftar dengan nama pengguna ${username}`, res)
    }  catch (err) {
        response(500, `Registasi anda gagal`,err.message, res)
    }  
}

const login = async (req, res) => {
    try {
        const {email, username, password} = req.body
        // if(!email || !username || !password) return response(400, null, 'Username/email dan password wajib diisi', res);
        const user = await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]
        })
        if (!user) return response(400, null,`username atau password salah`, res )
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return response(400, null, `username atau password salah`, res)
        const token = jwt.sign(
            {id: user._id, role: user.role}, PRIVATE_KEY ,
            {algorithm: 'RS256' , expiresIn: "1h"}
        )
        response(200, { token }, 'Login berhasil', res);
    } catch (err){
        response(500, null, err.message, res);
    }
}
module.exports = {
    register,
    login
}