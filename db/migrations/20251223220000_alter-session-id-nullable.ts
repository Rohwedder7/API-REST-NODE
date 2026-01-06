import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasTransactions = await knex.schema.hasTable("transactions");
  if (!hasTransactions) return;

  const hasSessionId = await knex.schema.hasColumn("transactions", "session_id");

  // Se não existir ainda, cria como nullable + index (seguro)
  if (!hasSessionId) {
    await knex.schema.alterTable("transactions", (table) => {
      table.uuid("session_id").nullable().index();
    });
    return;
  }

  // Postgres: garantir nullable
  await knex.raw(`ALTER TABLE transactions ALTER COLUMN session_id DROP NOT NULL`);
}

export async function down(knex: Knex): Promise<void> {
  const hasTransactions = await knex.schema.hasTable("transactions");
  if (!hasTransactions) return;

  const hasSessionId = await knex.schema.hasColumn("transactions", "session_id");
  if (!hasSessionId) return;

  // rollback opcional: voltar a NOT NULL (se você realmente quiser)
  // await knex.raw(`ALTER TABLE transactions ALTER COLUMN session_id SET NOT NULL`);
}
