<script>
	import { MoveRight, Pause, Play, Youtube, AudioLines, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// AIzaSyCwtl1NYsKWIA1Fr1ZEUh171xMBE0maalI

	let loading;
	let response;
	let winWidth = 0;

	async function getVideoTitle() {
		const videoId = youtubeLink.match(
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
		)[1];

		if (!videoId) {
			return;
		}
		loading = true;
		player = false;
		response = 'Fetching Video';
		const apiKey = import.meta.env.VITE_PUBLIC_YT; // Replace 'YOUR_API_KEY' with your actual YouTube Data API key
		const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;

		try {
			const res = await fetch(apiUrl);
			const data = await res.json();

			if (data.items && data.items.length > 0) {
				response = data.items[0].snippet;
				loading = false;

				return data.items[0].snippet.title;
			} else {
				response = 'Video not found';
				loading = false;

				throw new Error('Video not found');
			}
		} catch (error) {
			response = 'Error fetching video title';
			console.error('Error fetching video title:', error);
			loading = false;
			return null;
		}
	}

	let player;
	let buffering = false;
	let playing = true;

	function playVideoAsAudio() {
		const videoId = youtubeLink.match(
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
		)[1];

		if (!videoId) {
			response = 'Invalid Video';
			return;
		}

		if (player) {
			pauseAudio();
			return;
		}

		buffering = true;
		// Create a new HTML element for the YouTube player
		const playerElement = document.createElement('div');
		playerElement.id = 'player';
		document.body.appendChild(playerElement);

		// Function called when YouTube API is loaded

		// Create a new YouTube player
		player = new YT.Player('player', {
			height: '00', // Set height to 0 to hide the video player
			width: '00', // Set width to 0 to hide the video player
			videoId: videoId, // Use the extracted video ID
			playerVars: {
				autoplay: 1, // Auto-play the video
				controls: 0, // Hide video controls
				loop: 1, // Loop the video
				modestbranding: 1, // Hide YouTube logo
				playsinline: 1, // Play inline on mobile devices
				iv_load_policy: 3, // Hide video annotations
				vq: 'medium'
			},

			events: {
				onStateChange: onPlayerStateChange // Call onPlayerStateChange function when the player state changes
			}
		});

		console.log(player);
	}

	function pauseAudio() {
		if (player && player.getPlayerState) {
			const playerState = player.getPlayerState();
			if (playerState === YT.PlayerState.PLAYING) {
				player.pauseVideo();
				playing = false;
			} else {
				playing = true;
				player.playVideo();
				console.log('The video is already paused.');
			}
		}
	}

	function onPlayerStateChange(event) {
		if (event.data === YT.PlayerState.PLAYING) {
			// console.log('Video is done buffering.');
			buffering = false;
			// Video is done buffering and started playing
			// You can perform further actions here
		}

		// Listen for visibility change events

		// if (document.visibilityState === 'hidden') {
		// 	// Document is not visible (e.g., minimized)
		// 	player.playVideo();
		// 	console.log('Window is minimized or not visible');
		// } else {
		// 	// Document is visible
		// 	console.log('Window is visible');
		// }
	}

	// async function playVideoAsAudio() {
	// 	const videoId = youtubeLink.match(
	// 		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
	// 	)[1];
	// 	const apiUrl = `https://www.youtube.com/get_video_info?video_id=${videoId}`;

	// 	try {
	// 		const response = await fetch(apiUrl);
	// 		const data = await response.text();

	// 		// Parse the response to extract audio stream URL
	// 		const decodedData = decodeURIComponent(data);
	// 		const audioURL = decodedData.match(/url_encoded_fmt_stream_map=(.*)/)[1].split(',')[0];
	// 		const audioStreamURL = decodeURIComponent(audioURL.match(/url=(.*)/)[1]);

	// 		// Create an HTML5 audio element and play the audio stream
	// 		const audioElement = new Audio(audioStreamURL);
	// 		audioElement.play();
	// 	} catch (error) {
	// 		console.error('Error fetching audio stream:', error);
	// 	}
	// }

	// Example usage:
	// const youtubeLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Example YouTube video link
	// playVideoAudio(youtubeLink);

	// let youtubeLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Example YouTube video link
	let youtubeLink;
	// getVideoTitle()
	//     .then(title => {
	//         if (title) {
	//             console.log('Video title:', title);
	//         } else {
	//             console.log('Failed to fetch video title.');
	//         }
	//     });

	onMount(() => {
		winWidth = window.innerWidth;

		window.addEventListener('resize', () => {
			winWidth = window.innerWidth;
		});

		// Listen for visibility change events
		document.addEventListener('visibilitychange', function () {
			if (document.visibilityState === 'hidden') {
				// Document is not visible (e.g., minimized)
				if (player) {
					const playerState = player.getPlayerState();
					if (playerState != YT.PlayerState.PLAYING && playing) {
						player.playVideo();
					}
				}

				console.log('Window is minimized or not visible');
			} else {
				// Document is visible
				console.log('Window is visible');
			}
		});
	});
</script>

<div class="flex flex-col md:flex-row min-h-screen">
	<div class="w-full p-6 md:flex-1 md:bg-stone-800 text-black">
		<div class="h-full w-full text-red-500 flex flex-col items-center justify-center">
			{#key winWidth}
				<AudioLines size={winWidth * 0.2} />
			{/key}
			<h1 class="text-xl text-rose-200">Liseen</h1>
		</div>
	</div>
	<div class="w-full flex-1 flex-col flex items-center justify-center gap-5">
		<div class="flex items-center justify-center gap-0 w-full p-4">
			<input
				type="url"
				on:submit={getVideoTitle}
				bind:value={youtubeLink}
				placeholder="Video URL"
				class="bg-stone-800 p-2 rounded-l-lg w-full text-sm"
			/>
			<button on:click={getVideoTitle} class="bg-red-500 px-3 py-2 rounded-r-lg text-black w-fit"
				><div>
					<MoveRight />
				</div></button
			>
		</div>

		{#if loading || response}
			<div class="w-full border-l-2 border-red-500 gap-2 p-2 bg-stone-900 flex flex-col">
				<div class="flex justify-between items-center">
					<div class="text-sm flex gap-1 items-center justify-center">
						<Youtube />
						{response?.title ?? response}
					</div>
					{#if response.title}
						<button
							on:click={playVideoAsAudio}
							class="bg-red-500 px-5 py-2 rounded-lg text-black w-fit"
						>
							{#if !buffering}
								{#if playing}
									<Pause />
								{:else}
									<Play />
								{/if}
							{:else}
								<div class="animate-spin"><Loader2 /></div>
							{/if}
						</button>
					{/if}
				</div>
				{#if response.thumbnails}
					<img src={response.thumbnails.high.url} alt="" srcset="" />
				{/if}
			</div>
		{/if}
	</div>
</div>
