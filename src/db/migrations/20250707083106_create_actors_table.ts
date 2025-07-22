import type { Knex } from "knex";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('actors', table => {
        table.increments('id').primary();
        table.string('fullName').notNullable().defaultTo('');
        table.text('bio').notNullable().defaultTo('');
        table.string('sex').notNullable().defaultTo('unknown');
        table.string('date_of_birth').notNullable().defaultTo('1970-01-01'); // Default date if not provided
        table.timestamps(true, true); // created_at and updated_at timestamps
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex): Promise<void> {
return knex.schema.dropTableIfExists('actors');
};
