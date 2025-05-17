import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { createConnection } from '@node_modules/mysql2';
import { hash } from 'bcrypt';
import connection from '@app/lib/dbConnection';

dotenv.config();



export async function POST(request) {
    try {
        const { firstName, lastName, email, password } = await request.json();

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        // Hash the password before storing
        const hashedPassword = await hash(password, 10);
        const result = await connection.execute(
            'INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword]
        );

        await connection.end();

        return NextResponse.json(
            { message: 'User registered successfully.', user: { id: result.insertId, firstName, lastName, email } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
    }
}