<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import type { IUser } from '~/types/user'

const store = useStore()
const drawerContent = useDrawer()

const states = reactive({
    loading: false,
    errorText: null as null | string,
    userData: {
        phone: null,
    } as IUser,
})

onMounted(() => {
    //
})

const handleRefreshPage = () => {
    states.errorText = null;
}

const saveUserData = async () => {
    try {
        states.loading = true;
        states.errorText = null;

        if (!validateData()) {
            return;
        }

        store.value.phone = states.userData.phone;

        const response = await $fetch.raw(`${useApi()}/register-user`, {
            method: 'POST',
            body: {
                email: store.value.email,
                phone: states.userData.phone
            }
        });
    
        if (response.status === 200) {
            useToast().add({
                title: '✅ Номер телефона успешно сохранен!',
                close: false,
            });

            store.value.phone = states.userData.phone;
            drawerContent.value.state = 'final-page';
        } else {
            throw new Error('Ошибка сервера');
        }
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

const items = ref<StepperItem[]>([
    {
        title: 'Авторизация',
        description: 'Отправьте нам ваш Email',
        icon: 'ant-design:mail-outlined'
    },
    {
        title: 'Оплата',
        description: 'Доступ к тренировкам',
        icon: 'ant-design:credit-card-outlined'
    },
    {
        title: 'Ваши данные',
        description: 'Доступ к закрытому каналу',
        icon: 'material-symbols:person-outline'
    }
])

const active = ref(2)

function validateData(): boolean {
    if (!states.userData.phone) {
        states.errorText = 'Введите номер телефона';
        return false;
    }

    const phoneRegex = /^[\d\+\(\)\-\s]{10,15}$/;
    const cleanPhone = states.userData.phone.replace(/\D/g, '');

    if (cleanPhone.length < 10 || cleanPhone.length > 15 || !phoneRegex.test(states.userData.phone)) {
        states.errorText = 'Введите корректный номер телефона (10-15 цифр)';
        return false;
    }

    return true;
}

function formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    const invalidFirstDigits = '01234569';
    if (value && invalidFirstDigits.includes(value.charAt(0))) {
        states.errorText = `Номер телефона не может начинаться с ${value.charAt(0)}`;
        return false;
    }
    
    if (value.length > 0) {
        value = value.replace(/^(\d{0,1})?(\d{0,3})?(\d{0,3})?(\d{0,4})?/, (match, p1, p2, p3, p4) => {
        let result = '';
        if (p1) result += p1;
        if (p2) result += ' ' + p2;
        if (p3) result += ' ' + p3;
        if (p4) result += ' ' + p4;
        return result;
        }).trim();
    }

    input.value = value;
    states.userData.phone = value;
    clearError();
}

function clearError() {
    states.errorText = null;
}
</script>

<template>
    <div class="px-2">

        <UStepper v-model="active" :items="items" size="sm" class="w-full" disabled />

        <USeparator class="mt-4" />

        <base-page class="mt-4" :loading="states.loading" :error-text="states.errorText" :show-error-btn="true"
            @refresh="handleRefreshPage">

            <section class="l-buttons gap-1 mt-4">

                <label for="phone-input" class="l-label flex">
                    <span>Номер телефона</span>
                    <input type="tel" id="phone-input" placeholder="7 999 999 9999" :value="states.userData.phone"
                        @input="formatPhone" maxlength="14">
                </label>

                <label class="l-label flex">
                    <UButton class="justify-center" size="lg" @click="saveUserData" :loading="states.loading"
                        :disabled="states.loading">
                        <span class="text-[16px] line-clamp-1">
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