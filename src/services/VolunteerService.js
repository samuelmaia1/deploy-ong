import db from '../../db/db-config.js'
import bcrypt from 'bcryptjs'
import TokenService from './TokenService.js';

class VolunteerService{
    
    async addVolunteer(volunteer){
        console.log(volunteer)
        const { volunteerCode, name, phone, address, birthDate, registerDate, email, password } = volunteer

        if (!volunteerCode || !name || !phone || !address || !birthDate || !registerDate || !email || !password) throw new Error("Todos os campos devem estar preenchidos")

        try {
            const result = await db('INSERT INTO voluntarios (cod_voluntario, nome, telefone, endereco, data_nascimento, data_cadastro, email, senha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [volunteerCode, name, phone, address, birthDate, registerDate, email, await bcrypt.hash(password, 10)])

            console.log(result.rows)

            return {
                name: result.rows[0].nome,
                id: result.rows[0].cod_voluntario
            }
        } catch (error) {
            if (error.message.includes('duplicar valor da chave viola a restrição de unicidade')) throw new Error('Voluntário com este e-mail já existe')
            throw new Error(error.message)
        }
    }

}

export default VolunteerService