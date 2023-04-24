import * as server from '../entries/pages/logout/_page.server.js';

export const index = 4;
export const component = async () => (await import('../entries/pages/logout/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/logout/+page.server.js";
export const imports = ["_app/immutable/entry/logout-page.svelte.5d57e2f0.js","_app/immutable/chunks/index.65606941.js"];
export const stylesheets = [];
export const fonts = [];
