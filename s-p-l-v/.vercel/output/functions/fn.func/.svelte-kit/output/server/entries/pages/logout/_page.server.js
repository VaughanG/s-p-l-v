import { f as fail } from "../../../chunks/index.js";
import { a as auth } from "../../../chunks/lucia.js";
const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) {
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
  }
};
const actions = {
  default: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (session) {
      await auth.invalidateSession(session.sessionId);
      locals.auth.setSession(null);
    }
    throw fail(302, "/");
  }
};
export {
  actions,
  load
};
