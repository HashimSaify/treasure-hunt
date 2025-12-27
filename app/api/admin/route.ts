import {
  getTeamsSnapshot,
  incrementTeamAttempts,
  isValidTeamId,
  resetAllTeams,
} from "../../gameState";

export async function GET() {
  return Response.json({ teams: getTeamsSnapshot() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  if (action === "reset") {
    resetAllTeams();
    return Response.json({ ok: true });
  }

  if (action === "increment") {
    const teamId = body?.teamId;
    const amount = body?.amount;

    if (!isValidTeamId(teamId)) {
      return Response.json({ ok: false, error: "Invalid teamId" }, { status: 400 });
    }

    incrementTeamAttempts(teamId, Number(amount ?? 1));
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: "Invalid action" }, { status: 400 });
}
