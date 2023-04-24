<script>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import '../app.postcss';
	import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte'
    import { siteTitle } from '$lib/config'
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
  
	export let data;
</script>
<svelte:head>
<title>{siteTitle}</title>
</svelte:head>
<AppShell>
	<svelte:fragment slot="header">
	<AppBar>
		<svelte:fragment slot="lead">
		  <Header />
	    </svelte:fragment>
	    <svelte:fragment slot="trail">
		{#if !data.user}
		<a href="/login" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">Sign in</a>
        <a href="/signup" class="ml-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">Sign up</a>
		{:else}
		<a href="/profile" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">{data.user.username}</a>
        <a href="/logout" class="ml-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">Sign out</a>
		{/if}
	    </svelte:fragment>
	  </AppBar>
    </svelte:fragment>
		 
		<main id="main" class="justify-center flex flex-auto">
		   <slot />
		 </main>
		 
		<Footer />
</AppShell>
