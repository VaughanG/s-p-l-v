import * as server from '../entries/pages/_layout.server.js';

export const index = 0;
export const component = async () => (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.js";
export const imports = ["_app/immutable/entry/_layout.svelte.6511c929.js","_app/immutable/chunks/index.65606941.js","_app/immutable/chunks/index.9248998a.js"];
export const stylesheets = ["_app/immutable/assets/_layout.a3bbb6cb.css"];
export const fonts = [];
