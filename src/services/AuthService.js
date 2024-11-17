import db from '../../db/db-config.js'
import bcrypt from 'bcrypt'
import TokenService from './TokenService.js';

const tokenService = new TokenService()

class AuthService{
    async login(user, type){
        const result = await db(`SELECT * FROM ${type} WHERE email = $1`, [user.email])

        if (result.rows.length > 0) {
            const validUser = result.rows[0]

            if (await bcrypt.compare(user.password, validUser.senha))
                return {
                    authorized: true,
                    user: {
                        id: validUser.cod_usuario,
                        name: validUser.nome,
                        phone: validUser.telefone,
                        birthDate: validUser.data_nascimento,
                        email: validUser.email  
                    },
                    token: tokenService.generateToken({cod_usuario: validUser.cod_usuario, role: 'user'})
                }

            throw new Error('Credenciais inválidas')
        }

        throw new Error('Usuário com este email não existe')
    }
}

export default AuthService