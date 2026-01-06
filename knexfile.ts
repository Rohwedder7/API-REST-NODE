import { config } from './src/database'

export default {
    test: config,
    development: config,
    production: config,
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations'
    }
}
