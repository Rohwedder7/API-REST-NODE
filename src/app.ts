import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoute } from './routes/transactions'

// para criar uma instancia no fastify devemos chamar a função fastify() dentro de uma variavel!
export const app = fastify()

app.register(cookie)
app.register(transactionsRoute, {
    prefix: '/transactions',
})
