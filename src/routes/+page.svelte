<script>
	import headPhone from '$lib/images/herooo.png';
	import {
		Columns2,
		MoveRightIcon,
		VideoOffIcon,
		DatabaseIcon,
		SettingsIcon,
		ShieldBan
	} from 'lucide-svelte';
	import { fly } from 'svelte/transition';
</script>

<div transition:fly={{ y: -500 }} class="min-h-screen flex flex-col items-center justify-center">
	<div class="flex flex-col gap-4 items-center justify-center h-screen md:h-fit">
		<img src={headPhone} alt="" srcset="" />
		<h1 class="text-3xl md:text-6xl flex">
			Listen to <div class="relative isolate">
				<span
					class="before:absolute before:w-full before:h-full before:block before:-z-10 before:skew-y-3 before:skew-x-4 text-black before:bg-[#ffc200] -z-[1]"
					>Youtube</span
				>
			</div>
			Video
		</h1>
		<a
			href="/liseen"
			class="cta-button bg-[#ff4e44] rounded-xl w-fit px-5 py-3 flex gap-2 text-black"
			>Start Listening <MoveRightIcon /></a
		>
	</div>

	<section class=" py-20">
		<div class="container mx-auto px-4">
			<h2 class="text-4xl font-bold text-center mb-16">Key Benefits</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				<div class="bg-[#ffc200] rounded-lg shadow-lg p-6 flex flex-col items-center">
					<VideoOffIcon size="48" class="text-red-500 mb-4" />
					<h3 class="text-xl font-semibold mb-2 text-black">Minimize Distractions</h3>
					<p class="text-gray-800 text-center">
						Enjoy your favorite YouTube content without the visual clutter. <span
							class="italic underline decoration-wavy decoration-red-500">Liseen</span
						> strips away the video, allowing you to fully immerse yourself in the audio experience.
					</p>
				</div>
				<div class="bg-[#ffc200] rounded-lg shadow-lg p-6 flex flex-col items-center">
					<Columns2 size="48" class="text-red-500 mb-4" />
					<h3 class="text-xl font-semibold mb-2 text-black">Multitask with Ease</h3>
					<p class="text-gray-800 text-center">
						Listen to your favorite podcasts, music, tutorials, or audiobooks while working,
						exercising, or commuting. <span
							class="italic underline decoration-wavy decoration-red-500">Liseen</span
						> keeps the audio playing in background.
					</p>
				</div>
				<div class="bg-[#ffc200] rounded-lg shadow-lg p-6 flex flex-col items-center">
					<DatabaseIcon size="48" class="text-red-500 mb-4" />
					<h3 class="text-xl font-semibold mb-2 text-black">Reduce Data Usage</h3>
					<p class="text-gray-800 text-center">
						By playing only the audio, <span
							class="italic underline decoration-wavy decoration-red-500">Liseen</span
						> significantly reduces data usage, making it ideal for those with limited data plans or
						slow internet connections.
					</p>
				</div>
				<div class="bg-[#ffc200] rounded-lg shadow-lg p-6 flex flex-col items-center">
					<!-- <SettingsIcon size="48" class="text-red-500 mb-4" /> -->
					<ShieldBan size="48" class="text-red-500 mb-4" />
					<h3 class="text-xl font-semibold mb-2 text-black">Ads Free</h3>
					<p class="text-gray-800 text-center">
						Enjoy your favorite content 100% free from ads interrupt.
					</p>
				</div>
			</div>
		</div>
	</section>

	<footer class="mb-5">
		From <a href="https://yaqeen.me" class="text-[#ffc200]" target="_blank">Abdulmumin Yaqeen</a> &copy;
		2024
	</footer>
</div>

<style>
	.cta-button {
		/* display: inline-block; */
		/* padding: 15px 30px; */
		/* font-size: 20px; */
		font-weight: bold;
		color: hsl(0, 98%, 18%);
		background-color: #ff4d4d;
		border: 2px solid #ff4d4d;
		border-radius: 30px;
		cursor: pointer;
		outline: none;
		transition: all 0.3s;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}

	.cta-button:before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: rgba(255, 255, 255, 0.1);
		transition: all 0.5s;
		z-index: 1;
		transform: rotate(45deg);
	}

	.cta-button:hover:before {
		top: 150%;
		left: 150%;
	}

	.cta-button:hover {
		background-color: #ff6666;
		/* Lighter shade of red */
		transform: scale(1.05) rotate(2deg);
		/* Scale up and rotate slightly */
		box-shadow:
			0px 12px 20px rgba(255, 102, 102, 0.4),
			0px 20px 40px rgba(255, 102, 102, 0.3);
		/* Add multiple layers of shadow */
		transition: all 0.3s;
	}
</style>
