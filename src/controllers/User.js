import express from 'express'
import { randomUUID } from 'node:crypto'
import UserService from '../services/UserService.js'
import TokenService from '../services/TokenService.js'
import AuthService from '../services/AuthService.js'

const userService = new UserService()
const tokenService = new TokenService()
const authService = new AuthService()

const router = express.Router()

router.get('/', async (req, res) => {
    const token = tokenService.recoverToken(req)

    if (!token) return res.status(401).json({error: 'Token não fornecido.'})

    try {
        const allUsers = await userService.getAllUsers(token)
        return res.status(200).json(allUsers)
    } catch (error) {
        if (error.message === 'Permissão negada.') return res.status(403).json({error: error.message})
    }
})

router.post('/registrar', async (req, res) => {
    const data = req.body
    data.userCode = randomUUID()

    try {
        const newUser = await userService.addUser(data) 

        return res.status(201).json(newUser)
    } catch (error) {
        if (error.message === 'Todos os campos devem estar preenchidos' || error.message === 'Usuário com este e-mail já existe')
            return res.status(400).json({error: error.message})

        return res.status(500).json({error: 'Erro interno ao criar usuário'})
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    try {
        const loginResponse = await authService.login({email, password}, 'usuarios')

        if (loginResponse.authorized)
            return res.status(200).json(loginResponse)
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Credenciais inválidas' || error.message === 'Usuário com este email não existe') return res.status(401).json({error: error.message})

        return res.status(500).send(JSON.stringify({error: 'Erro interno ao processar login.'}))
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params

    try {
        const user = await userService.getUserById(id)

        if (user !== null)
            return res.status(200).json(user)

        throw new Error('Usupario com este id não existe.')
    } catch (error) {
        
        if (error.message ==='Usupario com este id não existe.')
            return res.status(404).json({error: 'Usuario não encontrado'})

        return res.status(500).json({error: 'Erro interno ao carregar usuário'})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        if (await userService.deleteUser(req.params.id)) return res.status(204).json({ok: true, message: 'Usuário deletado com sucesso'})
    } catch (error) {
        if (error.message === 'Usuário com este id não encontrado') return res.status(404).json({error: 'Usuário não encontrado'})
        return res.status(500).json({error: 'Erro interno ao deletar usuário'})
    }
})

export default router   