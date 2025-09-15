<script setup lang="ts">

const states = reactive({
	errorText: null as null | string,
});

onBeforeMount(() => {
	// useWebAppViewport().expand()
})
</script>

<template>
	<div v-if="states.errorText" style="color: red; padding: 20px;">
		Error: {{ states.errorText }}
	</div>
	<UApp v-else>
		<div class="bg-[var(--ui-bg)]">
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</div>
	</UApp>
</template>
