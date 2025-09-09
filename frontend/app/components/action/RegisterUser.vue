<script setup lang="ts">
import type { IUser } from '~/types/user';

const states = reactive({
	loading: false,
	errorText: null as null | string,
	userData: {
		email: '',
		name: '',
		phone: '',
		birthdate: '',
		weight: null,
		height: null,
	} as IUser
});

const store = useStore();

onMounted(() => {
	loadSavedData();
});

const handleRefreshPage = () => {
	states.errorText = null;
};

async function loadSavedData() {
	try {
		states.loading = true;
		states.userData = {
			email: useStore().value.email,
			name: store.value.name,
			phone: store.value.phone,
			birthdate: store.value.birthdate,
			weight: store.value.weight,
			height: store.value.height,
		};
	} catch (err) {
		console.error('Ошибка загрузки данных:', err);
	} finally {
		states.loading = false;
	}
}

async function saveUserData() {
	try {
		states.loading = true;
		states.errorText = null;

		if (!validateData()) {
			return;
		}

		store.value.name = states.userData.name;
		store.value.phone = states.userData.phone;
		store.value.birthdate = states.userData.birthdate;
		store.value.weight = states.userData.weight;
		store.value.height = states.userData.height;

		registerUser(states.userData);

	} catch (err) {
		console.error('Ошибка сохранения:', err);
		states.errorText = 'Ошибка при сохранении данных';
		useToast().add({
			title: '❌ Ошибка при сохранении данных',
			close: false,
		});
	} finally {
		states.loading = false;
	}
}

const registerUser = async (item: IUser) => {
	states.loading = true;
	try {
		let clearPhone = item.phone?.replace(/\D/g, '') ?? null;
		const res = await $fetch.raw<{ message: string }>(useApi() + '/register-user', {
			method: 'POST',
			body: {
				email: item.email,
				firstname: item.name,
				phone: clearPhone,
				birthdate: item.birthdate,
				weight: item.weight,
				height: item.height,
			},
		});

		if (res.status === 200 && res._data) {
			useDrawer().value.isOpen = false;

			useToast().add({
				title: '✅ Данные успешно сохранены!',
				close: false,
			});
		}

	} catch (err: unknown) {
		console.error(err);
		const errText = err as { data: { error: string } };
		useToast().add({
			title: errText.data.error.startsWith('Марафон уже открыт') ? '✅ Марафон уже открыт' : `❌ ${errText.data.error}`,
			close: false,
		});
	} finally {
		states.loading = false;
	}
};

function validateData(): boolean {

	if (!states.userData.name?.trim()) {
		states.errorText = 'Введите имя';
		return false;
	}

	if (states.userData.name?.trim().length < 2) {
		states.errorText = 'Имя должно содержать минимум 2 символа';
		return false;
	}

	if (!states.userData.phone?.trim()) {
		states.errorText = 'Введите номер телефона';
		return false;
	}

	const phoneRegex = /^[\d\+\(\)\-\s]{10,15}$/;
	const cleanPhone = states.userData.phone?.replace(/\D/g, '');

	if (cleanPhone.length < 10 || cleanPhone.length > 15 || !phoneRegex.test(states.userData.phone)) {
		states.errorText = 'Введите корректный номер телефона (10-15 цифр)';
		return false;
	}

	if (!states.userData.birthdate?.trim()) {
		states.errorText = 'Введите дату рождения';
		return false;
	}

	const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
	if (!dateRegex.test(states.userData.birthdate)) {
		states.errorText = 'Введите дату в формате ДД.ММ.ГГГГ';
		return false;
	}

	if (!states.userData.weight) {
		states.errorText = 'Введите вес';
		return false;
	}

	if (isNaN(states.userData.weight) || states.userData.weight <= 25 || states.userData.weight > 300) {
		states.errorText = 'Введите корректный вес (от 25 до 300 кг)';
		return false;
	}

	if (!states.userData.height) {
		states.errorText = 'Введите рост';
		return false;
	}

	if (isNaN(states.userData.height) || states.userData.height <= 100 || states.userData.height > 250) {
		states.errorText = 'Введите корректный рост (от 100 до 250 см)';
		return false;
	}

	return true;
}

function clearError() {
	states.errorText = null;
}

function formatPhone(event: Event) {
	const input = event.target as HTMLInputElement;
	let value = input.value.replace(/\D/g, '');

	if (value.length > 0) {
		value = value.replace(/^(\d{1,1})?(\d{1,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/, (match, p1, p2, p3, p4, p5) => {
			let result = '';
			if (p1) result += p1;
			if (p2) result += ' ' + p2;
			if (p3) result += ' ' + p3;
			if (p4) result += ' ' + p4;
			if (p5) result += ' ' + p5;
			return result;
		}).trim();
	}

	input.value = value;
	states.userData.phone = value;
	clearError();
}

function formatBirthdate(event: Event) {
	const input = event.target as HTMLInputElement;
	let value = input.value.replace(/\D/g, '');

	if (value.length > 0) {
		value = value.replace(/^(\d{0,2})?(\d{0,2})?(\d{0,4})?/, (match, p1, p2, p3) => {
			let result = '';
			if (p1) result += p1;
			if (p2) result += '.' + p2;
			if (p3) result += '.' + p3;
			return result;
		});
	}

	// Удаляем лишние точки в начале
	value = value.replace(/^\.+|\.+$/g, '');

	input.value = value;
	states.userData.birthdate = value;
	clearError();
}
</script>

<template>
	<div>
		<h1 class="text-white">Пожалуйста, заполняйте данные корректно!</h1>
		<base-page class="mt-2" :loading="states.loading" :error-text="states.errorText" :show-error-btn="true"
			@refresh="handleRefreshPage">
			<section class="l-buttons gap-1 mt-4 text-white py-4">

				<label for="name-input" class="l-label flex">
					<span>Имя</span>
					<input type="text" id="name-input" placeholder="Иван" v-model="states.userData.name"
						@input="clearError">
				</label>

				<label for="phone-input" class="l-label flex">
					<span>Номер телефона</span>
					<input type="tel" id="phone-input" placeholder="8 967 624 3733" :value="states.userData.phone"
						@input="formatPhone" maxlength="15">
				</label>

				<label for="birthdate-input" class="l-label flex">
					<span>Дата рождения</span>
					<input type="text" id="birthdate-input" placeholder="01.01.1999" :value="states.userData.birthdate"
						@input="formatBirthdate" maxlength="10">
				</label>

				<label for="weight-input" class="l-label flex">
					<span>Текущий вес (кг)</span>
					<input type="number" id="weight-input" placeholder="75" v-model="states.userData.weight"
						@input="clearError">
				</label>

				<label for="height-input" class="l-label flex">
					<span>Текущий рост (см)</span>
					<input type="number" id="height-input" placeholder="180" v-model="states.userData.height"
						@input="clearError">
				</label>

				<label class="l-label flex">
					<UButton size="lg" @click="saveUserData" :loading="states.loading" :disabled="states.loading">
						<span class="line-clamp-1">
							{{ states.loading ? 'Сохранение...' : 'Сохранить данные' }}
						</span>
					</UButton>
				</label>

			</section>

		</base-page>
	</div>
</template>

<style scoped>
.l-label {
	display: flex;
	gap: 10px;
	flex-direction: column;
	margin-bottom: 20px;
}

.l-label input {
	border: 1px solid gray;
	border-radius: 10px;
	padding: 10px;
	font-size: 16px;
}

.l-label input:focus {
	outline: none;
	border-color: #de9f51;
	box-shadow: 0 0 0 1px rgb(163, 104, 15)
}
</style>