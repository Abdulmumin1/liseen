<script>
	import { getToast } from '$lib/index.js';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let toast = getToast();

	onMount(() => {
		setTimeout(() => ($toast = false), $toast.duration ?? 3000);
	});
</script>

<div
	class="fixed bottom-0 mb-4 bg-red-500 text-black px-4 py-2 rounded-lg border transition-all duration-300 border-red-700"
	transition:fly={{ y: 300 }}
>
	{$toast.message}
</div>
