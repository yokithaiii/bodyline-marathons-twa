<script setup lang="ts">
interface IListMarathon {
	buy_link: string;
	is_new_user: boolean;
	have_workout: boolean;
	have_subscription: boolean;
	user: {
		id: string;
		firstname: string;
		lastname: string;
		avatar_url: string;
		password: string | null;
	};
	workout: {
		id: string;
		title: string;
		price: number;
		description: string;
	}
}

const drawerContent = useDrawer();
const store = useStore();

const states = reactive({
	text: '',
	loading: false,
	errorText: null as null | string,
	data: null as null | IListMarathon,
	showPayment: false,
});

const getData = async () => {
	states.loading = true;
	try {
		const res = await $fetch.raw<IListMarathon>(useApi() + `/check-user?email=` + useStore().value.email);

		if (res.status === 200 && res._data) {
			states.data = res._data;
			states.data.user.password = store.value.password;
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
	getData();
});

const handleRefreshPage = () => {
	states.errorText = null;
	getData();
};

const openCardDetail = (state: string) => {
	if (state === 'pay' && states.data?.buy_link) {
		drawerContent.value.state = state;
		drawerContent.value.paymentUrl = states.data.buy_link;
		drawerContent.value.isOpen = true;
	} else {
		drawerContent.value.state = state;
		drawerContent.value.isOpen = true;
	}
};

</script>

<template>
	<div>
		<span v-if="states.data && states.data.is_new_user === false" class="text-xl">

		</span>
		<span v-else class="text-xl">

		</span>

		<base-page class="mt-2" :loading="states.loading" :error-text="states.errorText" :show-error-btn="true"
			@refresh="handleRefreshPage">
			<div v-if="states.data">
				<div v-if="states.data.is_new_user === false">
					<UCard variant="subtle" class="mt-[20px] text-white">
						<template #header>
							<h2>
								У вас есть аккаунт в приложении💪🏽
							</h2>
						</template>

						<div class="flex items-center gap-[10px]">
							<UAvatar v-if="states.data.user.avatar_url" :src="states.data.user.avatar_url" size="xl" />
							<span>{{ states.data.user?.firstname }} {{ states.data.user?.lastname != null ? states.data.user?.lastname : '' }}🏆</span>
						</div>
						
						<div v-if="states.data.user.password" class="mt-[10px]">
							<span>Ваш новый пароль: {{ states.data.user?.password ?? '' }}</span>
						</div>

						<template #footer>
							<UButton @click="openCardDetail('pay')">
								<span class="text-[14px] line-clamp-1">Оплатить</span>
							</UButton>
						</template>
					</UCard>
				</div>

				<div v-else class="text-white">
					<h2>
						Упс! Мы заметили что у Вас нет аккаунта.
						<br>
						Надо пройти небольшое анкетирование для Вашего результата💪🏽
					</h2>
					<br>
					<UButton @click="openCardDetail('register')">
						<span class="text-[14px] line-clamp-1">Пройти анкетирование</span>
					</UButton>
				</div>

			</div>

			<div v-else>
				Данные не найдены
			</div>

		</base-page>
	</div>
</template>
