<script setup lang="ts">
import { useWebApp } from 'vue-tg';
import { BodyModalEmail } from '#components';
import type { IMarathon } from '~/types/marathon';

const states = reactive({
	text: '',
	loading: false,
	errorText: null as null | string,
	data: null as null | IMarathon,
});

const tma = useWebApp();
const store = useStore();
const drawerContent = useDrawer();

const openModalEmail = () => {
	useModal().open(BodyModalEmail, {
		title: 'Смена почты',
		descr: ' Укажите новую почту:',
		state: 'email',
	});
};

const getMarathon = async () => {
	states.loading = true;
	try {
		const res = await $fetch.raw<IMarathon>(useApi() + `/get-marathon`);

		if (res.status === 200 && res._data) {
			states.data = res._data;
		}

	} catch (err: any) {
		states.errorText = null;
		console.error(err);
		states.errorText = err.data.error || 'Что - то пошло не так, попробуйте еще';
	} finally {
		states.loading = false;
	}
};

onMounted(() => {
	store.value.username = tma.initDataUnsafe.user?.username;
	getMarathon();
});

</script>

<template>
	<section class="l-index">
		<div class="bg-emerald-100 dark:bg-zinc-950 rounded-[8px] mt-1">
			<div class="l-wrapper">
				<div class="py-4">
					<h1 class="text-xl text-white">
						Привет
						<span class="text-emerald-400">!</span>
					</h1>

					<h2 class="text-lg text-white">
						Вы на странице покупки марафона -
						<br>
						<span class="text-emerald-400">"{{ states.data?.title }}"</span>
					</h2>

					<div v-if="store.email" class="mt-2 text-white">
						<span class="text-[14px]">
							Указанная почта:
							<span class="text-emerald-400" @click="openModalEmail">
								{{ store.email }}
							</span>
							- нажмите чтобы изменить
						</span>
					</div>

					<main-buttons />

				</div>
			</div>
		</div>

		<UDrawer v-model:open="drawerContent.isOpen">
			<template #content>
				<article class="my-4 px-2 h-screen overflow-y-auto">

					<template v-if="drawerContent.state === 'marathon'">
						<action-get-marathon />
					</template>

					<template v-if="drawerContent.state === 'register'">
						<action-register-user />
					</template>

					<template v-if="drawerContent.state === 'pay'">
						<action-payment-page />
					</template>

				</article>
			</template>
		</UDrawer>
	</section>
</template>
