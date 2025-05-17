import { jwtVerify } from 'jose';
export async function POST(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const user =await jwtVerify(token, secret);
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
        }
        const response = new Response(JSON.stringify({ message: 'Logout successful.' }), { status: 200 });
        response.headers.append('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
        return response;
    } catch (error) {
        console.error('Error during logout:', error);
        return new Response(JSON.stringify({ error: 'Logout failed' }), { status: 500 });
    }

}