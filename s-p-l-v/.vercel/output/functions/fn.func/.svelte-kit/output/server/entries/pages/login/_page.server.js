import { r as redirect, f as fail } from "../../../chunks/index.js";
import { a as auth } from "../../../chunks/lucia.js";
const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session)
    throw redirect(302, "/");
};
const actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
      console.log("Invalid credentials");
      return fail(400);
    }
    try {
      const key = await auth.useKey("username", username, password);
      const session = await auth.createSession(key.userId);
      locals.auth.setSession(session);
    } catch {
      console.log("Invalid credentials");
      return fail(400);
    }
  }
};
export {
  actions,
  load
};
