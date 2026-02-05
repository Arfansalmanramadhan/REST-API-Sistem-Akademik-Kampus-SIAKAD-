const jwt = require(`jsonwebtoken`)
const response = require(`../utility/response`)
const PUBLIC_KEY = require(`../servers/jwtkey`)

const verifikasiToken = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith(`Bearer`)) return response(401, null, `token tidak ditemukan`, res)
        
        const token = authHeader.split(` `)[1]

        try {
            const decoded = jwt.verify(token, PUBLIC_KEY, {
                algorithms: ['RS256']
            })
            req.user = decoded
            const userRole = decoded.role?.toLowerCase()
            if (roles.length && !roles.includes(userRole)) return response(403, null, 'akses di tolak', res)
            next()
        } catch (err) {
            response(401, null, `token tidak valid`, res)
        }
    }
} 
module.exports = verifikasiToken