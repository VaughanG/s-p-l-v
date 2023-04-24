import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from "$lib/server/lucia";
import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia-auth';


const schema = z.object({
    name: z.string().min(3).max(32),
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20),
});

export const load = (async (event) => {
  // Server API:
  const form = await superValidate(event, schema);

  // Redirect if user is already logged in
  const session = await event.locals.auth.validate();
  if (session) throw redirect(302, "/");
  
  // Always return { form } in load and form actions.
  return { form };
  

});

export const actions = {
    default: async (event) => {
        // Same syntax as in the load function
        const form = await superValidate(event, schema);
        console.log('POST', form);
    
        // Convenient validation check:
        if (!form.valid) {
            // Again, always return { form } and things will just work.
            return fail(400, { form });
        }
  
        // TODO: Do something with the validated data
        // descructure data from form
        const { name, username, email, password } = form.data;

        // try catch block to create user and return error if user already exists
        try {
            const user = await auth.createUser({
                primaryKey: {
                    providerId: "username",
                    providerUserId: username,
                    password
                },
                attributes: {
                    name,
                    username,
                    email
                }
            });
            const session = await auth.createSession(user.userId);
            event.locals.auth.setSession(session);
        } catch (error) {
            
            if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002' &&
				error.message?.includes('username')
			) {
				return fail(400, {
					message: 'Username already in use'
				});
			}
			if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
				return fail(400, {
					message: 'Username already in use'
				});
			}
			console.error(error);
			return fail(500, {
				message: 'Unknown error occurred'
			});            
            
            // username already in use
            return fail(400, { form });
        }

  
        // Yep, return { form } here too
        return { form };
    }
  };
  