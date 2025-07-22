import type { Knex } from "knex";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('movie-genre', table => {
    table.increments('id').primary();
    table.integer('movie_id').unsigned().notNullable();
    table.integer('genre_id').unsigned().notNullable();
    table.foreign('movie_id').references('id').inTable('movies').onDelete('CASCADE');
    table.foreign('genre_id').references('id').inTable('genres').onDelete('CASCADE');
    table.timestamps(true, true); // created_at and updated_at timestamps
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTableIfExists('movie-genre');
};
