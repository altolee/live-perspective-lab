const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

function headers() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase 尚未完成设定");
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function GET() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_lpl_stats`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ p_event_code: "CARE2026" }),
      cache: "no-store",
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "统计服务暂时不可用" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_lpl_response`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        p_participant_id: body.participantId,
        p_role: body.role,
        p_behaviors: body.behaviors ?? [],
        p_emotions: body.emotions ?? [],
        p_stance: body.stance ?? null,
        p_event_code: "CARE2026",
      }),
      cache: "no-store",
    });
    if (!response.ok) return Response.json({ error: await response.text() }, { status: response.status });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "回应送出失败" }, { status: 400 });
  }
}
