<script>
	import '../app.css';
</script>

<svelte:head>
	<!-- HTML Meta Tags -->
	<title>Liseen</title>
	<meta
		name="description"
		content="Listen to youtube videos as audio - for music, podcasts and others."
	/>

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://liseen.vercel.app" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Liseen" />
	<meta
		property="og:description"
		content="Listen to youtube videos as audio - for music, podcasts and others."
	/>
	<meta property="og:image" content="/liseen.png" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="liseen.vercel.app" />
	<meta property="twitter:url" content="https://liseen.vercel.app" />
	<meta name="twitter:title" content="Liseen" />
	<meta
		name="twitter:description"
		content="Listen to youtube videos as audio - for music, podcasts and others."
	/>
	<meta name="twitter:image" content="/liseen.png" />

	<!-- Meta Tags Generated via https://www.opengraph.xyz -->
</svelte:head>

<main class="bg-stone-950 text-white flex-col font-ibm">
	<slot />
</main>
