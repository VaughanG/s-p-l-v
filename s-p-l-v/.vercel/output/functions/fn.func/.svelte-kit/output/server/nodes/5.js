import * as server from '../entries/pages/profile/_page.server.js';

export const index = 5;
export const component = async () => (await import('../entries/pages/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/+page.server.js";
export const imports = ["_app/immutable/entry/profile-page.svelte.0e579d71.js","_app/immutable/chunks/index.65606941.js"];
export const stylesheets = [];
export const fonts = [];
