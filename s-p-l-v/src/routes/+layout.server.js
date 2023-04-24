export const load = async ({ locals }) => {
	const { user, session } = await locals.auth.validateUser()
	return { user }
}