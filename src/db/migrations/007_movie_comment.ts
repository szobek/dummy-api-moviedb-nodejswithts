import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
      return knex.schema.createTable('movie-comment', table => {
        table.increments('id').primary();
        table.integer('movie_id').unsigned().notNullable();
        table.foreign('movie_id').references('id').inTable('movies').onDelete('CASCADE');
        table.text('comment').notNullable().defaultTo('');
        table.timestamps(true, true); // created_at and updated_at timestamps
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('movie-comment');
}

