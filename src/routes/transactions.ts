import type { FastifyInstance } from "fastify"
import { knexIn } from "../database"
import { z } from "zod"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middleware/check-session-id-exists"



export async function transactionsRoute(app: FastifyInstance) {
    // Hook global para trazer a informação da requisição feita para cada rota dessa função.
    app.addHook('preHandler', async (req, reply) => {
        console.log(`[${req.method}] ${req.url}`)
    })
    // Route implementation goes here
    // dentro do fastify ja temos os métodos http (get, post, put, delete, etc)
    // Cookies sao formas de manter contexto entre requisições HTTP, geralmente utilizados para autenticação e sessão de usuário.
    // Para trabalahar com Cookies no Fastify é necessário instalar o plugin @fastify/cookie
    app.post(`/`, async (req, reply) => {
        // lógica para criar uma nova transação, nesse caso iremos utilizar o req.body para pegar os dados enviados pelo cliente.

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = createTransactionBodySchema.parse(
            req.body
        )

        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()
            
            // definir o cookie na resposta
            reply.setCookie('sessionId', sessionId, {
                path: '/', // o cookie estará disponível em todas as rotas
                maxAge: 60 * 60 * 24 * 7, // 7 dias
            })
        }
        

        await knexIn('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            created_at: new Date(),
            session_id: sessionId,
        })

            // retornar o http 201
        return reply.status(201).send({
            message: "Transaction created successfully"
        })
        
        })

    app.get('/',{ preHandler: [checkSessionIdExists] } ,async (req, reply) => {
        const { sessionId } = req.cookies

        // Para trazer as informacoes eu devo guardar ela dentro de uma variavel    
        const transactions = await knexIn('transactions')
            .where('session_id', sessionId) // filtrar as transações pelo session_id
            .select('*')

        return reply.status(200).send({
            transactions
        })
    })  

    app.get('/:id', { preHandler: [checkSessionIdExists] }, async (req, reply) => {
        const { sessionId } = req.cookies
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
        })
        
        const { id } = getTransactionParamsSchema.parse(req.params)
        
        const transaction = await knexIn('transactions')
            .where('id', id)
            .where('session_id', sessionId)
            .first()
                    
        return reply.status(200).send({
            transaction
        })
    })

    app.get('/summary', { preHandler: [checkSessionIdExists] }, async (req, reply) => {
        const { sessionId } = req.cookies

        const summary = await knexIn('transactions')
            .where('session_id', sessionId)
            .sum('amount', { as: 'amount' })
            .first()

        return reply.status(200).send({
            summary
        })
    })
}