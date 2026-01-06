import type { FastifyRequest, FastifyReply } from "fastify"
// funcao criada para verificar se o sessionId existe nos cookies

export async function checkSessionIdExists(req: FastifyRequest, reply: FastifyReply) {
    const sessionId = req.cookies.sessionId

    if (!sessionId) {
        return reply.status(401).send({
            message: 'Unauthorized'
        })
    }
}