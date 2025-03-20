export const POST = async (req) => {
    return new Response(JSON.stringify({ success: "AAAAAA POST request" }), {
        body: "testsetestets",
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}