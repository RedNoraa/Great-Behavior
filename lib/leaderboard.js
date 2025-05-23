export function calculateLeaderboard(names, timers) {
  const data = names.map((name, i) => ({ name, points: timers[i]?.points || 0 }));
  return data.sort((a, b) => b.points - a.points);
}
