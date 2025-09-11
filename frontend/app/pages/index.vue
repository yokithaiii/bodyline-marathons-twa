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
const overlay = useOverlay();
const modal = overlay.create(BodyModalEmail);

const openModalEmail = () => {
  modal.open({
    title: 'Смена почты',
    descr: 'Укажите новую почту:',
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
	getMarathon();
});

</script>

<template>
	<section class="l-index">
		<div class="bg-emerald-100 dark:bg-zinc-950 rounded-[8px] mt-1">
			<div class="l-wrapper">
				<div class="py-4">
					<h1 class="text-xl text-white">
						Привет<span class="text-emerald-400 ml-[2px]">!</span>
					</h1>

					<template v-if="states.loading">
						<USkeleton class="mt-2 h-5 w-[300px] mb-1" />
						<USkeleton class="mt-2 h-5 w-[250px]" />
					</template>
					<template v-else>
						<h2 class="text-lg text-white mt-2">
							Вы на странице покупки марафона -
							<br>
							<span class="text-emerald-400">{{ states.data?.title }}</span>
						</h2>
					</template>

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

					<template v-if="drawerContent.state === 'get-email-page'">
						<action-get-email />
					</template>

					<template v-if="drawerContent.state === 'payment-page'">
						<action-payment-page />
					</template>

					<template v-if="drawerContent.state === 'final-page'">
						<action-final-page />
					</template>

					<template v-if="drawerContent.state === 'get-phone-page'">
						<action-get-phone />
					</template>

				</article>
			</template>
		</UDrawer>
	</section>
</template>
