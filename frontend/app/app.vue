<script setup lang="ts">
import { useWebAppViewport } from 'vue-tg'

onBeforeMount(() => {
	useWebAppViewport().expand()
})
</script>

<template>
	test page
	
</template>
