import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 0. Remove o índice se existir
  await knex.schema.raw('DROP INDEX IF EXISTS transactions_session_id_index');

  // 1. Renomeia a tabela antiga
  await knex.schema.renameTable('transactions', 'transactions_old');

  // 2. Cria a nova tabela com session_id nullable
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary();
    table.text('title').notNullable();
    table.decimal('amount').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.uuid('session_id').nullable().index();
  });

  // 3. Copia os dados da tabela antiga para a nova
  await knex.raw(`
    INSERT INTO transactions (id, title, amount, created_at, session_id)
    SELECT id, title, amount, created_at, session_id FROM transactions_old
  `);

  // 4. Remove a tabela antiga
  await knex.schema.dropTable('transactions_old');
}

export async function down(knex: Knex): Promise<void> {
  // Implemente o rollback se necessário (opcional)
}