<script setup lang="ts">
const drawerContent = useDrawer();
const store = useStore();

const openCardDetail = (state: string) => {
	if (store.value.email) {
		if (store.value.have_workout) {
			drawerContent.value.state = 'final-page';
		} else {
			drawerContent.value.state = 'payment-page';
		}
	} else {
		drawerContent.value.state = state;
	}
	drawerContent.value.isOpen = true;
};

const actionButtons = [
	{
		id: 1,
		title: 'Купить марафон 🏆',
		state: 'get-email-page',
	}
];
</script>

<template>
	<section class="l-buttons gap-1 mt-4">
		<UButton class="justify-center" v-for="item in actionButtons" :key="item.id" size="lg" @click="openCardDetail(item.state)">
			<span class="text-[18px] line-clamp-1"> {{ item.title }} </span>
		</UButton>
	</section>
</template>

<style scoped>
.l-buttons {
	display: grid;
	grid-template-columns: 1fr;
}
</style>
