import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWTSECRET = process.env.JWT_SECRET

class TokenService{

    generateToken(user){
        return jwt.sign(
            {id: user.cod_usuario, role: user.role},
            JWTSECRET,
            {expiresIn: '72h'}
        )
    }

    validateToken(token){
        return jwt.verify(token, JWTSECRET)
    }

    recoverToken(req){
        const authHeader = req.headers.authorization

        if (!authHeader) return null

        return authHeader.split(' ')[1]
    }
    
}

export default TokenService