import * as server from '../entries/pages/login/_page.server.js';

export const index = 3;
export const component = async () => (await import('../entries/pages/login/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/login/+page.server.js";
export const imports = ["_app/immutable/entry/login-page.svelte.f6612e2a.js","_app/immutable/chunks/index.65606941.js","_app/immutable/chunks/forms.7e25f850.js","_app/immutable/chunks/parse.1d2978b5.js","_app/immutable/chunks/singletons.6aa1f7af.js","_app/immutable/chunks/index.9248998a.js"];
export const stylesheets = [];
export const fonts = [];
