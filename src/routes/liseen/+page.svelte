<script>
	import { fly } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';

	import { MoveRight } from 'lucide-svelte';

	import Playcard from '$lib/components/playcard.svelte';
	import Recent from '$lib/components/recent.svelte';
	import Visualizer from '$lib/components/visualizer.svelte';
	import { newState, setToast, getToast } from '$lib/index.js';
	import Toast from '$lib/components/toast.svelte';
	setToast(null);

	let toast = getToast();

	let loading;
	let response;
	let winWidth = 0;
	let videoInfo;

	async function getVideoTitle(link) {
		let videoId;
		try {
			videoId = link.match(
				/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
			)[1];

			if (!videoId) {
				let message = 'Invalid YouTube Link :/';
				$toast = { message };

				return;
			}
		} catch (error) {
			let message = 'Invalid YouTube Link :/';
			$toast = { message };
			return;
		}

		loading = true;
		player = false;
		response = 'Fetching Video';
		const apiKey = import.meta.env.VITE_PUBLIC_YT;
		const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;

		try {
			const res = await fetch(apiUrl);
			const data = await res.json();

			if (data.items && data.items.length > 0) {
				videoInfo = data.items[0];
				response = data.items[0].snippet;
				loading = false;
				newState.set(false);
				// playVideoAsAudio()

				return data.items[0].snippet.title;
			} else {
				response = 'Video not found :/';
				loading = false;
				$toast = { message: response };

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
	let playing = false;

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
				loop: looping ? 0 : 1, // Loop the video
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

		// console.log(player);
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
	let looping;
	function onPlayerStateChange(event) {
		if (event.data === YT.PlayerState.PLAYING) {
			// console.log('Video is done buffering.');
			buffering = false;
			playing = true;

			timelineInterval = setInterval(() => {
				playedPercentage = (player.getCurrentTime() / duration) * 100;
			}, 1000); // Update every second
			// Video is done buffering and started playing
			// You can perform further actions here
			return;
		} else if (event.data === YT.PlayerState.ENDED) {
			// The video has finished playing
			playing = false;
			if (looping) {
				player.seekTo(0, true);
				player.playVideo();
			}
		} else if (event.data == YT.PlayerState.BUFFERING) {
			playing = false;
			buffering = true;
		}

		clearInterval(timelineInterval);
	}

	let youtubeLink;

	let playedPercentage;
	let duration;
	function onPlayerReady(event) {
		// Start updating the played percentage when the video is playing
		duration = player.getDuration();
		playing = true;
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

	onDestroy(() => {
		newState.set(true);
	});

	function toggleVideoLooping(event) {
		let isLooping = event.detail.repeat;
		looping = isLooping;
		// console.log(isLooping);
		if (player) {
			player.setLoop(isLooping);
			// console.log('video will loop', isLooping);
		}
	}

	// setContext('playing', playing)
	// setContext{''}
</script>

<div class="flex justify-center h-screen overflow-hidden">
	<div class="max-w-5xl flex relative justify-center w-full">
		<div class="flex max-w-[30rem] w-full flex-col md:flex-row">
			<div class="w-full flex-1 flex-col flex md:items-center justify-center gap-5">
				{#if loading}
					<div
						class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-stone-900 bg-opacity-75 z-50"
					>
						<div
							class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"
						></div>
					</div>
				{/if}
				{#if $newState}
					<div class="box w-full">
						<form
							in:fly={{ y: 500 }}
							class="flex card rounded-lg md:rounded-xl items-center justify-center gap-0 w-full focus-within:border-2 border-red-500 border"
						>
							<input
								type="url"
								bind:value={youtubeLink}
								placeholder="Video URL"
								class="bg-stone-800 p-2 md:p-4 rounded-l-lg md:rounded-l-xl w-full text-sm border-2 border-stone-800 z-50 focus:outline-none"
							/>
							<button
								on:click={() => getVideoTitle(youtubeLink)}
								class="bg-red-500 px-3 py-2 md:py-4 rounded-r-md md:rounded-r-lg text-black w-fit z-50"
								><div>
									<MoveRight />
								</div></button
							>
						</form>
					</div>
				{:else if response && response?.title}
					<!-- {#if videoInfo} -->
					<Playcard
						on:loop={toggleVideoLooping}
						{response}
						{youtubeLink}
						{playVideoAsAudio}
						bind:playing
						bind:buffering
					/>
					<Visualizer
						on:seek={(event) => seekToPercentage(event)}
						bind:duration
						bind:playedPercentage
					/>
				{/if}
			</div>
		</div>
		<Recent bind:playing bind:buffering bind:loading {getVideoTitle} bind:player bind:youtubeLink />
	</div>

	<!-- {#key loading} -->
	<!-- {/key} -->

	{#if $toast}
		<Toast />
	{/if}
</div>

<style>
	.box {
		position: relative;
		transform-style: preserve-3d;
	}
	.box::before {
		content: '';
		position: absolute;
		inset: -20px;
		background: conic-gradient(
			from 90deg at 40% -25%,
			#ffd700,
			#f79d03,
			#ee6907,
			#e6390a,
			#de0d0d,
			#d61039,
			#cf1261,
			#c71585,
			#cf1261,
			#d61039,
			#de0d0d,
			#ee6907,
			#f79d03,
			#ffd700,
			#ffd700,
			#ffd700
		);
		filter: blur(80px);
		transform: translate3d(0px, 0px, -1px);
		left: 50%;
		translate: -50% -30%;
		border-radius: 100%;
		height: 300px;
		width: 300px;

		pointer-events: none;
	}
	.card {
		position: relative;

		overflow: hidden;
	}
	.card::before,
	.card.card::after {
		content: '';
		position: absolute;
	}

	.card::before {
		width: 120%;
		height: 110%;
		background: linear-gradient(#e6390a, #f79d03);
		animation: rotate 3s ease infinite;
		z-index: 2;

		transform-origin: left;
	}

	@keyframes rotate {
		to {
			rotate: 360deg;
		}
	}
</style>
