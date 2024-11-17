import pkg from 'pg'
const {Pool} = pkg

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'ong'
})

const query = async (queryString, params) => {
    const client = await pool.connect()
    try {
        if (!params){
            const res = await client.query(queryString)
            return res
        }    
        const res = await client.query(queryString, params)
        return res
    }
    finally{
        client.release()
    }
}

export default query