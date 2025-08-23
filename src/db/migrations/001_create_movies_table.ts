import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('movies', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.integer('year').notNullable();
    table.float('rating').notNullable();
    table.string('director').notNullable().defaultTo('Unknown');
    table.text('description').notNullable();
    table.string('poster_url').notNullable().defaultTo('https://picsum.photos/200/300');
    table.integer("showings_count").notNullable().defaultTo(0);
    table.timestamps(true, true); // created_at and updated_at timestamps
  });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('movies');
}
