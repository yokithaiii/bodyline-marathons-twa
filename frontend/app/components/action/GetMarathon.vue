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
	};
	workout: {
		id: string;
		title: string;
		price: number;
		description: string;
	}
}

const drawerContent = useDrawer();

const states = reactive({
	text: '',
	loading: false,
	errorText: null as null | string,
	data: null as null | IListMarathon,
});

const getData = async () => {
	states.loading = true;
	try {
		const res = await $fetch.raw<IListMarathon>(useApi() + `/check-user?email=` + useStore().value.email);

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
	getData();
});

const handleRefreshPage = () => {
	states.errorText = null;
	getData();
};

const openCardDetail = (state: string) => {
	drawerContent.value.state = state;
	drawerContent.value.isOpen = true;
};

</script>

<template>
	<div>
		 <span v-if="states.data && states.data.is_new_user === false" class="text-2xl">
			{{ states.data.user?.firstname }} 🏆
		</span>
		<span v-else>
			Анкетирование нового пользователя 🏆
		</span>

		<base-page
			class="mt-2"
			:loading="states.loading"
			:error-text="states.errorText"
			:show-error-btn="true"
			@refresh="handleRefreshPage"
		>
			<div v-if="states.data">
				<div v-if="states.data.is_new_user === false">
					<h2> 
						У вас есть аккаунт💪🏽 
						<br>
						Ссылка на оплату
					</h2> 
				</div>

				<div v-else>
					<h2> 
						Надо пройти небольшое анкетирование для Вашего результата💪🏽 
						<br>
						Пожалуйста, заполняйте данные корректно!
					</h2>
					<br>
					<UButton size="lg" @click="openCardDetail('register')">
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
