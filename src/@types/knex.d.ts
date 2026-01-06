import { Knex } from "knex"

// A declaracao de modulo e necessaria para extender as tipagens do Knex, assim conseguimos definir como serao nossas tabelas e colunas no banco de dados.
declare module "knex/types/tables" {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amount: number
            created_at: Date
            // O ponto de interrogação indica que a coluna session_id é opcional (pode ser nula).
            session_id?: string | null
        }
    }
}