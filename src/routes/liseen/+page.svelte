<script>
	import { MoveRight, Pause, Play, Youtube, AudioLines, Loader2, ShapesIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Playcard from '../../lib/components/playcard.svelte';
	import Visualizer from '../../lib/components/visualizer.svelte';
	import { newState } from '$lib/index.js';
	import { fly } from 'svelte/transition';

	// AIzaSyCwtl1NYsKWIA1Fr1ZEUh171xMBE0maalI

	let loading;
	let response;
	let winWidth = 0;
	let videoInfo;

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
				videoInfo = data.items[0];
				response = data.items[0].snippet;
				loading = false;
				newState.set(false);

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
				onReady: onPlayerReady,
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

	let timelineInterval;
	function onPlayerStateChange(event) {
		if (event.data === YT.PlayerState.PLAYING) {
			// console.log('Video is done buffering.');
			buffering = false;

			timelineInterval = setInterval(() => {
				playedPercentage = (player.getCurrentTime() / duration) * 100;
				console.log(playedPercentage);
			}, 1000); // Update every second
			// Video is done buffering and started playing
			// You can perform further actions here
		} else {
			clearInterval(timelineInterval);
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

	// $: {
	// 	if (player && getPlayerState) {
	// 		player.getDuration();
	// 	}
	// }
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

	let playedPercentage;
	let duration;
	function onPlayerReady(event) {
		// Start updating the played percentage when the video is playing
		duration = player.getDuration();
		// setInterval(() => {
		// 	playedPercentage = (player.getCurrentTime() / duration) * 100;
		// 	console.log(playedPercentage);
		// }, 1000); // Update every second
	}

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

	function seekToPercentage(percentage) {
		percentage = percentage.detail.relativeMovement;
		if (!player) return;

		const duration = player.getDuration();
		const time = (percentage / 100) * duration;
		player.seekTo(time, true);
	}
</script>

<div class="flex justify-center overflow-clip">
	<div class="flex max-w-[30rem] w-full flex-col md:flex-row min-h-screen">
		<!-- <div class="w-full p-6 md:flex-1 md:bg-stone-800 text-black">
			<div class="h-full w-full text-red-500 flex flex-col items-center justify-center">
				{#key winWidth}
					<AudioLines size={winWidth * 0.2} />
				{/key}
				<h1 class="text-xl text-rose-200">Liseen</h1>
			</div>
		</div> -->
		<div class="w-full flex-1 flex-col flex md:items-center justify-center gap-5">
			{#if $newState}
				<div class="flex items-center justify-center gap-0 w-full p-4" transition:fly={{ y: 300 }}>
					<input
						type="url"
						on:submit={getVideoTitle}
						bind:value={youtubeLink}
						placeholder="Video URL"
						class="bg-stone-800 p-2 rounded-l-lg w-full text-sm"
					/>
					<button
						on:click={getVideoTitle}
						class="bg-red-500 px-3 py-2 rounded-r-lg text-black w-fit"
						><div>
							<MoveRight />
						</div></button
					>
				</div>
				{#if loading}
					<div
						class="w-full h-full absolute bg-stone-900 opacity-85 blur-3xl"
						transition:fly={{ y: 300 }}
					>
						<div class="ds animate-pulse">
							<ShapesIcon size={45} />
						</div>
					</div>
				{/if}
			{:else}
				<!-- <Visualizer duration={videoInfo} /> -->

				{#if response && videoInfo}
					{#if videoInfo}
						<Playcard {response} {playVideoAsAudio} bind:playing bind:buffering />
						<!-- {#if player} -->
						<!-- {/if} -->
						<Visualizer
							on:seek={(event) => seekToPercentage(event)}
							bind:duration
							bind:playedPercentage
						/>
					{:else}
						203 not foud
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.ds {
		position: absolute;
		top: 50%; /* Position the top edge of the child element at the vertical center of the parent */
		left: 50%; /* Position the left edge of the child element at the horizontal center of the parent */
		transform: translate(
			-50%,
			-50%
		); /* Use translate to adjust the position of the child element, moving it back by half its own width and height */
	}
</style>
