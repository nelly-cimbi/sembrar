const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/sembrar';

const client = new Client({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
console.log("---CONNNECTING TO PSQL---");
console.log("User: ", client.user);
console.log("Database: ", client.database);
console.log("Port: ", client.port);
console.log("Host: ", client.host);
console.log("-------------------------");

module.exports = client;