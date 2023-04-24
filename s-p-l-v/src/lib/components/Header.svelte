<script>
	import { siteTitle } from '$lib/config';
</script>

<header>

  <div class="relative flex items-center justify-between pb-4">
    <a href="/" aria-label="Company" title="{siteTitle}" class="inline-flex items-center">
      <svg class="w-8 text-deep-purple-accent-400" viewBox="0 0 24 24" stroke-linejoin="round"
       stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" stroke="currentColor" fill="none">
        <rect x="3" y="1" width="7" height="12"></rect>
        <rect x="3" y="17" width="7" height="6"></rect>
        <rect x="14" y="1" width="7" height="6"></rect>
        <rect x="14" y="11" width="7" height="12"></rect>
      </svg>
      <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 dark:text-gray-300 uppercase">{siteTitle}</span>
    </a>
    
  
</header>