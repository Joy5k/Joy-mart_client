// app/api/logout/route.js (Next.js 13+ App Router)
export async function GET() {
  const response = new Response(JSON.stringify({ success: true }), {
    headers: {
      "Set-Cookie": "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
    },
  });
  return response;
}