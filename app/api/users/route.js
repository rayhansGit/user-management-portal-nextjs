import { createConnection } from "@node_modules/mysql2";

export async function GET(request) {
    console.log('Fetching all users');
    const token = request.cookies.get('token')?.value;
    console.log('Token:', token);
    if (!token) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    try {
        const users = await getAllUsers();
        return new Response(JSON.stringify({ users }), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
}

function getAllUsers() {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };
    const connection = createConnection(dbConfig);
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
        connection.end();
    });
}

