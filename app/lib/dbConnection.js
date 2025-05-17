import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Test the connection
connection.getConnection()
    .then((conn) => {
        console.log('Connected to the database');
        conn.release();
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
export default connection;