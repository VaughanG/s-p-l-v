<!-- routes/signup/+page.svelte -->
<script>
	import { enhance } from "$app/forms";
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  
    import { superForm } from 'sveltekit-superforms/client';
    export let data;
    // Client API:
    const { form, errors, constraints } = superForm(data.form);
    
</script>


<div class="hero">
	<div class="hero-content flex-col lg:flex-row-reverse">
	  <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
		<div class="card-body">
		  <h2 class="card-title">Login</h2>
            <form method="POST" use:enhance>
                <div class="p-2">
                <label for="name" class="font-bold">Your full name</label><br />
                <input type="text" id="name" name="name" class="input input-bordered w-full max-w-xs"
                    data-invalid={$errors.name}
                    bind:value={$form.name}
                    {...$constraints.name} />
                    {#if $errors.name}<span class="text-rose-500">{$errors.name}</span>{/if}
                    <br />        
                </div>
                <div class="p-2">
                <label for="username" class="font-bold">Username</label><br />        
                <input type="text" id="username" name="username" class="input input-bordered w-full max-w-xs"
                    data-invalid={$errors.username}
                    bind:value={$form.username} 
                    {...$constraints.username} />
                    {#if $errors.username}<span class="text-rose-500">{$errors.username}</span>{/if}
                    <br />
                </div>
                <div class="p-2">
                <label for="email" class="font-bold">E-mail</label><br />
                <input type="text" id="email" name="email" class="input input-bordered w-full max-w-xs"
                    data-invalid={$errors.email}
                    bind:value={$form.email}
                    {...$constraints.email} />
                    {#if $errors.email}<span class="text-rose-500">{$errors.email}</span>{/if}
                    <br />        
                </div>
                <div class="p-2">
                <label for="password" class="font-bold">Password</label><br />
                <input type="password" id="password" name="password" class="input input-bordered w-full max-w-xs"
                    data-invalid={$errors.password}
                    bind:value={$form.password}
                    {...$constraints.password} />
                    {#if $errors.password}<span class="text-rose-500">{$errors.password}</span>{/if}
                    <br />
                </div>
                <div class="p-2">
                    <input type="submit" value="Signup" class="btn" />
                </div>
            </form>
		</div>
    </div>
  </div>
</div>