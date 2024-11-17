import express from 'express'
import { randomUUID } from 'node:crypto'
import TokenService from '../services/TokenService.js'
import VolunteerService from '../services/VolunteerService.js'

const volunteerService = new VolunteerService()
const tokenService = new TokenService()

const router = express.Router()

router.post('/registrar', async (req, res) => {   
    const data = req.body
    data.volunteerCode = randomUUID()

    try {
        const newVolunteer = await volunteerService.addVolunteer(data)

        return res.status(201).json(newVolunteer)
    } catch (error) {
        if (error.message === 'Todos os campos devem estar preenchidos' || error.message === 'Voluntário com este e-mail já existe')
            return res.status(400).json({error: error.message})

        return res.status(500).json({error: 'Erro interno ao criar voluntário'})
    }
})

router.post('/login', async (req, res) => {
    
})


export default router