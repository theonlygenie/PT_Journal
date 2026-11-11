import api from './stats-api.js';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

window.stats = api;

// Vercel Web Analytics (page views) and Speed Insights (page speed). Both are cookie-free, never see the game files or anything on the pages,
// and only run on the real site: on your own PC (localhost) nothing is loaded. They only collect data once switched on in the Vercel project.
if (!/^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(location.hostname)) {
  try { inject(); } catch {}
  try { injectSpeedInsights(); } catch {}
}
