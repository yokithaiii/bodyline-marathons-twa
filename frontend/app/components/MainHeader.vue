<script setup lang="ts">
import { SlideOver } from '#build/components';

const colorMode = useColorMode();
const slideover = useSlideover();

const isDark = computed({
	get() {
		return colorMode.value === 'dark';
	},
	set() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	},
});

function openSlideover() {
	slideover.open(SlideOver, { title: 'Полезные ссылки' });
}
</script>

<template>
	<header class="relative rounded-[8px] z-10 bg-emerald-100 dark:bg-zinc-950 mt-2">
		<div class="l-wrapper">
			<div class="flex items-center justify-between gap-4 py-4">
				<nuxt-link to="/" class="flex items-center gap-[10px]">
					<span class="text-xl mt-[5px] text-white">BODYLINE MARATHONS</span>
				</nuxt-link>

				<div class="flex items-center gap-1">
					<UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="primary" variant="ghost" @click="isDark = !isDark" />
					<button class="flex" @click="openSlideover">
						<UIcon name="i-prime:align-justify" class="size-7 bg-emerald-400" />
					</button>
				</div>
			</div>
		</div>
	</header>
</template>
