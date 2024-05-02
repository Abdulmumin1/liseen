<script>
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	export let duration, playedPercentage, buffering;

	import { spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	let rangeSlider;
	let thumb;
	let isDragging;
	let initialThumbPositionX = 0;

	let relativeMovement = 0;

	const dispatch = createEventDispatcher();

	function click(e) {
		const posX = e.clientX - rangeSlider.getBoundingClientRect().left;
		const newPos = Math.min(Math.max(posX, 0), rangeSlider.offsetWidth);
		thumb.style.left = newPos + 'px';

		relativeMovement = ((newPos - initialThumbPositionX) / rangeSlider.offsetWidth) * 100;
		dispatch('seek', { relativeMovement });
	}

	function handleMouseMove(e) {
		if (isDragging && !wait) {
			// console.log('touch jdsj');
			const posX = e.clientX - rangeSlider.getBoundingClientRect().left;
			const newPos = Math.min(Math.max(posX, 0), rangeSlider.offsetWidth);
			thumb.style.left = newPos + 'px';
			//   $track.style.width = newPos + 'px';
			// console.log(newPos);
			relativeMovement = ((newPos - initialThumbPositionX) / rangeSlider.offsetWidth) * 100;
		}
	}

	function handleTouchMove(e) {
		e.preventDefault(); // Prevent default touch event behavior
		const posX = e.touches[0].clientX - rangeSlider.getBoundingClientRect().left;
		const newPos = Math.min(Math.max(posX, 0), rangeSlider.offsetWidth);
		if (isDragging && !wait) {
			thumb.style.left = newPos + 'px';
		} else {
			coords.update(() => {
				return { x: newPos, y: 0 };
			});
		}
		relativeMovement = ((newPos - initialThumbPositionX) / rangeSlider.offsetWidth) * 100;
	}

	function handleMouseDown() {
		isDragging = true;
		wait = false;
	}

	let wait = false;

	function handleMouseup() {
		dispatch('seek', { relativeMovement });
		if (buffering) {
			wait = true;
			return;
		}
		isDragging = false;
	}

	function handleKeyDown(e) {
		if (!wait) {
			let newPos;
			let stepSize = 2;
			// finally:
			// console.log(thumb.style.left);
			// console.log(parseInt(thumb.style.left.replace('px')));

			switch (e.key) {
				case 'ArrowLeft':
					newPos = Math.max(parseInt(thumb.style.left.replace('px')) - stepSize, 0);
					break;
				case 'ArrowRight':
					newPos = Math.min(
						parseInt(thumb.style.left.replace('px')) + stepSize,
						rangeSlider.offsetWidth
					);
					break;
				case 'Home':
					newPos = 0;
					break;
				case 'End':
					newPos = rangeSlider.offsetWidth - 2;
					break;
				default:
					return;
			}

			relativeMovement = ((newPos - initialThumbPositionX) / rangeSlider.offsetWidth) * 100;

			if (parseInt(relativeMovement) < 100) {
				// console.log(relativeMovement);
				thumb.style.left = newPos + 'px';
				// dispatch()
				dispatch('seek', { relativeMovement });
			}
		}
	}

	$: {
		if (wait & !buffering) {
			// console.log(buffering);
			isDragging = false;
			wait = false;
		}
	}

	// $: console.log('done buffeting', buffering);

	const coords = spring({
		x: 0,
		y: 0
	});

	let played = 0;
	let remaining = null;
	$: {
		if (playedPercentage && duration) {
			played = Math.floor(duration * (playedPercentage / 100)) + 2;
			remaining = duration - played;

			coords.update(() => {
				return { x: playedPercentage, y: 0 };
			});
		}
	}

	let unsubscribe;

	onMount(() => {
		unsubscribe = coords.subscribe((current) => {
			// if ()
			if (thumb) {
				if (!isDragging && !wait && playedPercentage <= 100) {
					thumb.style.left = `${rangeSlider.offsetWidth * (playedPercentage / 100)}px`;
					// console.log('updated');
				} else if (playedPercentage <= 100) {
					thumb.style.left = `${current.x}px`;
				}
			}
		});

		// return () => {
		// 	unsubscribe();
		// };
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
	function formatDuration(durationInSeconds) {
		const hours = Math.floor(durationInSeconds / 3600);
		const minutes = Math.floor((durationInSeconds % 3600) / 60);
		const seconds = durationInSeconds % 60;

		const formattedHours = hours > 0 ? `${hours}h` : '';
		const formattedMinutes = `${minutes.toString().padStart(2, '0')}m`;
		const formattedSeconds = `${seconds.toString().padStart(2, '0')}s`;

		return `${formattedHours} ${formattedMinutes} ${formattedSeconds}`.trim();
	}
</script>

<!-- <div class="absolute z-50 bottom-0"> -->
<div
	class=" af w-full flex relative h-fit text-black cursor-pointer outline-none rounded-lg focus:outline-1 focus:outline-red-500"
	bind:this={rangeSlider}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={playedPercentage}
	role="slider"
	on:keydown={handleKeyDown}
	tabindex="0"
	on:mousemove={handleMouseMove}
	on:touchmove={handleTouchMove}
	transition:fly={{ y: 200, delay: 100 }}
	on:click={click}
>
	<!-- <span class="d absolute bottom-0">0:00</span> -->
	<span class="duration text-[11px] text-red-500 mx-1 select-none absolute left-0 z-50 bottom-0"
		>{formatDuration(played)}</span
	>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
		><path
			class="fill-red-500"
			fill-opacity="1"
			d="M0,224Q6,214,12,202.7C24,181,48,139,72,149.3C96,160,120,224,144,256C168,288,192,288,216,272Q228,264,240,256Q252,248,264,224Q276,200,288,181.3C312,139,336,85,360,101.3C384,117,408,203,432,229.3C456,256,480,224,504,218.7C528,213,552,235,576,229.3C600,224,624,192,648,181.3Q660,176,672,171Q684,166,696,181Q708,196,720,154.7C744,128,768,64,792,74.7C816,85,840,171,864,202.7C888,235,912,213,936,218.7C960,224,984,256,1008,234.7C1032,213,1056,139,1080,138.7C1104,139,1128,213,1152,234.7C1176,256,1200,224,1224,197.3Q1236,186,1248,171Q1260,156,1272,149Q1284,142,1296,144Q1308,146,1320,149Q1332,152,1344,149Q1356,146,1368,165.3Q1380,184,1392,213.3L1440,224L1440,320L1428,320Q1416,320,1392,320Q1368,320,1344,320Q1320,320,1296,320Q1272,320,1248,320Q1224,320,1200,320Q1176,320,1152,320Q1128,320,1104,320Q1080,320,1056,320Q1032,320,1008,320Q984,320,960,320Q936,320,912,320Q888,320,864,320Q840,320,816,320Q792,320,768,320Q744,320,720,320Q696,320,672,320Q648,320,624,320Q600,320,576,320Q552,320,528,320Q504,320,480,320Q456,320,432,320Q408,320,384,320Q360,320,336,320Q312,320,288,320Q264,320,240,320Q216,320,192,320Q168,320,144,320Q120,320,96,320Q72,320,48,320Q24,320,0,320Z"
		></path></svg
	>

	<div
		bind:this={thumb}
		class="thumb"
		role="slider"
		tabindex="0"
		aria-valuenow={playedPercentage}
		on:mousedown={handleMouseDown}
		on:mouseup={handleMouseup}
		on:touchstart={handleMouseDown}
		on:touchend={handleMouseup}
	></div>
	<!-- style="left: {isDragging && !wait ? $coords.x : playedPercentage}%;" -->
	<span class="duration text-[11px] text-red-950 mx-1 select-none absolute right-0 bottom-0"
		>{formatDuration(remaining ?? duration)}</span
	>
</div>

<!-- </div> -->

<style>
	.duration {
		mix-blend-mode: color-burn;
		color: black;
		font-size: 10px;
	}
	.af {
		overflow: hidden;
	}
	.thumb {
		width: 2px;
		background-color: #efc744;
		height: 100%;
		position: absolute;
		z-index: 10px;
		/* left: 10px; */
		cursor: grab;
		transition: all ease 100ms;
		/* overflow: hidden; */
	}

	.thumb:hover {
		/* transform: scaleX(2); */
	}

	.thumb::before {
		content: '';
		width: 0;
		height: 0;
		border-left: 0px solid transparent;
		border-right: 7px solid transparent;
		border-top: 12px solid #ef4444;
		/* transform: rotate(deg); */
		position: absolute;
		top: 0;
		left: 0px;
	}

	/* width: 500%; */
	.thumb::after {
		content: '';
		position: absolute;
		background-color: rgb(110, 22, 22);
		right: 0;
		width: 1000px;
		height: 100%;
		mix-blend-mode: darken;
		overflow: hidden;
	}
</style>
