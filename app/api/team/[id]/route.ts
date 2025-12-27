import { getTeamSnapshot, isValidTeamId } from "../../../gameState";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const teamId = params?.id;

  if (!isValidTeamId(teamId)) {
    return Response.json({ ok: false, error: "Invalid team" }, { status: 400 });
  }

  return Response.json({ ok: true, team: getTeamSnapshot(teamId) });
}
