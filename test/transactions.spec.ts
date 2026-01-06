import { afterAll, beforeAll, test, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'


describe('Transactions routes', () => {
// O describe serve para agrupar vários testes, como se fosse uma tipagem!

beforeAll(async () => {
    // Aguardando o app estar pronto para receber requisições
  await app.ready()
})

afterAll(async () => {
    // Fechando a aplicação após os testes
    await app.close()
})

beforeEach(async () => {
    // Rodar as migrations antes de cada teste
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
})

test('user can create a new transaction', async () => {
  // Aqui dentro você pode fazer suas requisições de teste e também as validacões
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'Test Transaction',
      amount: 100,
      type: 'credit',
    })
    .expect(201)
})

test('user can list all transactions', async () => {
   const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Test Transaction',
      amount: 100,
      type: 'credit',
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Test Transaction',
        amount: 100,
      }),
    ])

})

})

