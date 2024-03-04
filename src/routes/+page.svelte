<script>
	import headPhone from '$lib/images/herooo.png';
	import { MoveRightIcon, PlayIcon } from 'lucide-svelte';
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="flex flex-col gap-4 items-center justify-center">
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
		<a href="/liseen" class="bg-[#ff4e44] rounded-xl w-fit px-5 py-3 flex gap-2 text-black"
			>Start Listening <MoveRightIcon /></a
		>
	</div>
</div>
