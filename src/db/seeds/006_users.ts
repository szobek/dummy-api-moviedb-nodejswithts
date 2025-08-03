import { Knex } from "knex";
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
    const hashed=await bcrypt.hash('password', 10);
    await knex('users').del();
    await knex('users').insert([
        {
            "email":'test@test.com',
            "password":hashed,
            "role":'admin',
            "approved":1
        }
    ]);
   
};
