import connection from "@app/lib/dbConnection";

export async function GET(request) {
    try {
        const users = await getAllUsers();
        return new Response(JSON.stringify({ users }), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
}

async function getAllUsers() {
    const [rows] = await connection.query(
        'SELECT * FROM user'
    );
    return rows;
}

