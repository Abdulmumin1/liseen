<script>
	import { createEventDispatcher, onMount } from 'svelte';
	export let duration, playedPercentage;
	// createEventDispatcher
	import { spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	function extractDuration(videoInfo) {
		if (videoInfo && videoInfo.contentDetails && videoInfo.contentDetails.duration) {
			return parseISO8601Duration(videoInfo.contentDetails.duration);
		} else {
			return null;
		}
	}

	// Parse ISO 8601 duration format (e.g., PT4M13S)
	function parseISO8601Duration(duration) {
		if (!duration) {
			return;
		}
		const match = duration.match(/^PT(\d+H)?(\d+M)?(\d+S)?$/);

		const hours = (match[1] ? parseInt(match[1]) : 0) || 0;
		const minutes = (match[2] ? parseInt(match[2]) : 0) || 0;
		const seconds = (match[3] ? parseInt(match[3]) : 0) || 0;

		return hours * 3600 + minutes * 60 + seconds;
	}

	let rangeSlider;
	let thumb;
	let isDragging;
	let initialThumbPositionX = 0;

	let relativeMovement = 0;

	const dispatch = createEventDispatcher();

	function handleMouseMove(e) {
		if (isDragging) {
			// console.log('touch jdsj');
			const posX = e.clientX - rangeSlider.getBoundingClientRect().left;
			const newPos = Math.min(Math.max(posX, 0), rangeSlider.offsetWidth);
			thumb.style.left = newPos + 'px';
			//   $track.style.width = newPos + 'px';
			console.log(newPos);
			relativeMovement = ((newPos - initialThumbPositionX) / rangeSlider.offsetWidth) * 100;
		}
	}

	function handleTouchMove(e) {
		e.preventDefault(); // Prevent default touch event behavior
		const posX = e.touches[0].clientX - rangeSlider.getBoundingClientRect().left;
		const newPos = Math.min(Math.max(posX, 0), rangeSlider.offsetWidth);
		// thumb.style.left = newPos + 'px';
		coords.update(() => {
			return { x: newPos, y: 0 };
		});
		relativeMovement = ((newPos - initialThumbPositionX) / rangeSlider.offsetWidth) * 100;
	}

	function handleMouseDown() {
		isDragging = true;
		console.log('thouch ');
	}

	function handleMouseup() {
		isDragging = false;
		console.log(relativeMovement);
		dispatch('seek', { relativeMovement });
	}
	let a = 'end';

	const coords = spring({
		x: 0,
		y: 0
	});

	onMount(() => {
		coords.subscribe((current) => {
			// if ()
			thumb.style.left = `${current.x}px`;
		});
	});
	// $: {
	// 	a = parseISO8601Duration(duration);
	// }
</script>

<div
	class=" w-full flex relative h-fit text-black"
	bind:this={rangeSlider}
	on:mousemove={handleMouseMove}
	on:touchmove={handleTouchMove}
	transition:fly={{ y: 200, delay: 100 }}
>
	<!-- <span class="d absolute bottom-0">0:00</span> -->
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
		><path
			class="fill-red-500"
			fill-opacity="1"
			d="M0,288L8.6,256C17.1,224,34,160,51,128C68.6,96,86,96,103,112C120,128,137,160,154,176C171.4,192,189,192,206,186.7C222.9,181,240,171,257,165.3C274.3,160,291,160,309,165.3C325.7,171,343,181,360,176C377.1,171,394,149,411,149.3C428.6,149,446,171,463,197.3C480,224,497,256,514,240C531.4,224,549,160,566,154.7C582.9,149,600,203,617,197.3C634.3,192,651,128,669,106.7C685.7,85,703,107,720,117.3C737.1,128,754,128,771,138.7C788.6,149,806,171,823,154.7C840,139,857,85,874,74.7C891.4,64,909,96,926,133.3C942.9,171,960,213,977,202.7C994.3,192,1011,128,1029,133.3C1045.7,139,1063,213,1080,245.3C1097.1,277,1114,267,1131,272C1148.6,277,1166,299,1183,288C1200,277,1217,235,1234,229.3C1251.4,224,1269,256,1286,224C1302.9,192,1320,96,1337,64C1354.3,32,1371,64,1389,106.7C1405.7,149,1423,203,1431,229.3L1440,256L1440,320L1431.4,320C1422.9,320,1406,320,1389,320C1371.4,320,1354,320,1337,320C1320,320,1303,320,1286,320C1268.6,320,1251,320,1234,320C1217.1,320,1200,320,1183,320C1165.7,320,1149,320,1131,320C1114.3,320,1097,320,1080,320C1062.9,320,1046,320,1029,320C1011.4,320,994,320,977,320C960,320,943,320,926,320C908.6,320,891,320,874,320C857.1,320,840,320,823,320C805.7,320,789,320,771,320C754.3,320,737,320,720,320C702.9,320,686,320,669,320C651.4,320,634,320,617,320C600,320,583,320,566,320C548.6,320,531,320,514,320C497.1,320,480,320,463,320C445.7,320,429,320,411,320C394.3,320,377,320,360,320C342.9,320,326,320,309,320C291.4,320,274,320,257,320C240,320,223,320,206,320C188.6,320,171,320,154,320C137.1,320,120,320,103,320C85.7,320,69,320,51,320C34.3,320,17,320,9,320L0,320Z"
		></path></svg
	>
	<div
		bind:this={thumb}
		class="thumb"
		role="slider"
		on:mousedown={handleMouseDown}
		on:mouseup={handleMouseup}
		on:touchstart={handleMouseDown}
		on:touchend={handleMouseup}
		style="left: {playedPercentage}%;"
	></div>
	<span class="d absolute right-0 bottom-0">{a}</span>
</div>

<style>
	.d {
		writing-mode: vertical-lr;
		padding: 1px;
	}

	.thumb {
		width: 2px;
		background-color: #efc744;
		height: 100%;
		position: absolute;
		z-index: 10px;
		/* left: 10px; */
		cursor: pointer;
		transition: all ease 100ms;
	}

	.thumb:hover {
		transform: scaleX(2);
	}

	.thumb::before {
		content: '';
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 10px solid #ef4444;
		/* transform: rotate(deg); */
		position: absolute;
		top: 0;
		left: -4px;
	}
</style>
