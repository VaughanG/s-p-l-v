import * as server from '../entries/pages/signup/_page.server.js';

export const index = 6;
export const component = async () => (await import('../entries/pages/signup/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/signup/+page.server.js";
export const imports = ["_app/immutable/entry/signup-page.svelte.1ffc7e16.js","_app/immutable/chunks/index.65606941.js","_app/immutable/chunks/forms.7e25f850.js","_app/immutable/chunks/parse.1d2978b5.js","_app/immutable/chunks/singletons.6aa1f7af.js","_app/immutable/chunks/index.9248998a.js","_app/immutable/chunks/stores.45613faf.js"];
export const stylesheets = ["_app/immutable/assets/_page.021bd9b1.css"];
export const fonts = [];
