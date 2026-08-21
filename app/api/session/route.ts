const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const EVENT_CODES = new Set(["CARE2026", "UNPLANNED2026", "THORACIC2026", "MEDERROR2026", "WARDCONFLICT2026"]);

function eventCode(value: unknown) {
  return typeof value === "string" && EVENT_CODES.has(value) ? value : "CARE2026";
}

function headers() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase 尚未完成设定");
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rpc = body.action === "close" ? "close_lpl_session" : body.action === "start" ? "start_lpl_session" : null;
    if (!rpc) return Response.json({ error: "未知的场次操作" }, { status: 400 });

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${rpc}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ p_admin_pin: body.pin, p_event_code: eventCode(body.eventCode) }),
      cache: "no-store",
    });
    const text = await response.text();
    if (!response.ok) return Response.json({ error: text.includes("invalid admin pin") ? "管理密码不正确" : text }, { status: response.status });
    return Response.json(text ? JSON.parse(text) : { ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "场次操作失败" }, { status: 400 });
  }
}
