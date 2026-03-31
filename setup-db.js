import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:rsxWfozuZ8Zhvqvy@db.nuguzoxcfxgcwyunlanf.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function setup() {
  await client.connect();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS hospitals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      hospital_name TEXT NOT NULL,
      registration_number TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  try {
    await client.query(createTableQuery);
    console.log("Table 'hospitals' created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await client.end();
  }
}

setup();
