import { a as auth } from "./lucia.js";
const handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  return await resolve(event);
};
export {
  handle
};
