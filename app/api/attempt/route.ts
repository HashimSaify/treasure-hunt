import { isValidTeamId, submitTeamCode } from "../../gameState";

export async function POST(req: Request) {
  const { teamId, code, timeTaken } = await req.json();

  if (!isValidTeamId(teamId)) {
    return Response.json({ success: false, attemptsLeft: 0 });
  }

  const result = submitTeamCode(teamId, String(code ?? ""), Number(timeTaken ?? 0));
  return Response.json(result);
}
