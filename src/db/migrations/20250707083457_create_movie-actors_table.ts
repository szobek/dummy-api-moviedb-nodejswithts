import type { Knex } from "knex";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('movie-actors', table => {
        table.increments('id').primary();
        table.integer('movie_id').unsigned().notNullable();
        table.integer('actor_id').unsigned().notNullable();
        table.foreign('movie_id').references('id').inTable('movies').onDelete('CASCADE');
        table.foreign('actor_id').references('id').inTable('actors').onDelete('CASCADE');
        table.timestamps(true, true); // created_at and updated_at timestamps
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex): Promise<void> {
return knex.schema.dropTableIfExists('movie-actors');
};
