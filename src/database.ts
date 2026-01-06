import knex from 'knex'
import { env } from './env/index.js'

export const config = {
    client: env.DATABASE_CLIENT,
    // Aqui fazemos a verificação para saber se é sqlite ou pg e passamos a configuração correta para cada banco de dados.
    connection: env.DATABASE_CLIENT === 'sqlite' ? 
    {
        filename: env.DATABASE_URL,
    } :
    env.DATABASE_URL
    ,
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations'
    }
}
export const knexIn = knex(config)

