// The world card (trainer, badges, play time, place, party) normally comes from the game's world-card.ini. When that file cannot be read, the
// newest good card for the world is used; failing that, a card is built from the save itself (name, badges and play time are in it; the
// party comes from the save too, in the page). The place is the one thing the save cannot give, so it shows as a dash.
export function cardFromSave(data, world) {
  const tr = (data.trainer || {})[world];
  if (!tr || !tr.name) return null;
  return { trainer: tr.name, badges: tr.badges || 0, playTime: `${tr.hours}:${String(tr.minutes).padStart(2, '0')}`, place: '', party: [], fromSave: true };
}
