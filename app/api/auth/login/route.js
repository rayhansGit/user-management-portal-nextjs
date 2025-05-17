import { createConnection } from "@node_modules/mysql2";
import { compare } from "bcrypt";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
export const POST = async (req) => {
    const { email, password } = await req.json();
    if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required.' }), { status: 400 });
    }
    const user = await findUserByEmail(email);

    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid email or password.' }), { status: 401 });
    }
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        return new Response(JSON.stringify({ error: 'Invalid email or password.' }), { status: 401 });
    }
    const token = await generateJwtToken({ userId: user.id, email: user.email });
    return new Response(JSON.stringify({ message: 'Login successful.' }), {
        status: 200,
        headers: {
            'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600; 
            SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
            'Content-Type': 'application/json'
        }
    });
}


async function findUserByEmail(email) {
    const connection = createConnection(dbConfig);
    try {
        const [rows] = await connection.promise().query(
            'SELECT * FROM user WHERE email = ? LIMIT 1',
            [email]
        );
        connection.end();
        return rows[0];
    } catch (error) {
        connection.end();
        throw error;
    }
}

async function verifyPassword(inputPassword, storedPassword) {
    const match = await compare(inputPassword, storedPassword);
    return match; // Replace with actual password check
}

async function generateJwtToken(user) {
    var token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token expiration time
    });
    console.log(token);
    // return token;
    return token;
}