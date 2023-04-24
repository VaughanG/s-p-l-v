import { fail } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";

// If user is authenticated, logout and redirect to home page.
// If user is not authenticated, redirect to home page.
export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}
};

export const actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (session) {
			await auth.invalidateSession(session.sessionId);
			locals.auth.setSession(null);
		}
		throw fail(302, "/");
	}
};