import connection from "@app/lib/dbConnection";
import { jwtVerify } from "jose";
import { NextResponse } from "@node_modules/next/server";
import { compare } from "bcrypt";
import { SignJWT } from "jose";


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
    const response = NextResponse.json({ message: 'Login successful.' });

    response.cookies.set('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    return response;
}

export const GET = async (req) => {
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload: user } = await jwtVerify(token, secret);
        return new Response(JSON.stringify({ user }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
};


async function findUserByEmail(email) {
    const [rows] = await connection.execute(
        'SELECT * FROM user WHERE email = ? LIMIT 1',
        [email]
    );
    return rows[0];
}

async function verifyPassword(inputPassword, storedPassword) {
    const match = await compare(inputPassword, storedPassword);
    return match; // Replace with actual password check
}

async function generateJwtToken(user) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT(user)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secret);
    return token;
}