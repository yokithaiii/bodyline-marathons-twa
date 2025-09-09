<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

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

const UBadge = resolveComponent('UBadge')

type Payment = {
	id: string
	date: string
	status: 'now' | 'past' | 'future'
	name: string
	amount: number
}

const data = ref<Payment[]>([
	{
		id: '4600',
		date: '2024-02-11',
		status: 'future',
		name: 'james.anderson@example.com',
		amount: 999
	},
	{
		id: '4599',
		date: '2024-03-01',
		status: 'now',
		name: '🔥Сентябрьский марафон! Вместо 1999₽❌ всего 999₽✅',
		amount: 999
	},
	{
		id: '4598',
		date: '2024-04-25',
		status: 'past',
		name: 'Майский марафон ЖИРОТОП🔥',
		amount: 999
	},
])

const columns: TableColumn<Payment>[] = [
	{
		accessorKey: 'status',
		header: 'Статус',
		cell: ({ row }) => {
			const color = {
				now: 'success' as const,
				past: 'error' as const,
				future: 'neutral' as const
			}[row.getValue('status') as string]

			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => {
					if (row.getValue('status') === 'now') {
						return 'Идет';
					} else if (row.getValue('status') === 'past') {
						return 'Прошло';
					} else if (row.getValue('status') === 'future') {
						return 'Скоро';
					}
				}
			)
		}
	},
	{
		accessorKey: 'name',
		header: 'Название'
	},
	{
		accessorKey: 'date',
		header: 'Дата',
		cell: ({ row }) => {
			return new Date(row.getValue('date')).toLocaleString('ru-RU', {
				day: 'numeric',
				month: 'numeric',
				year: 'numeric',
			})
		}
	},
	{
		accessorKey: 'amount',
		header: () => h('div', { class: 'text-right' }, 'Цена'),
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue('amount'))

			const formatted = new Intl.NumberFormat('ru-RU', {
				style: 'currency',
				currency: 'RUB'
			}).format(amount)

			return h('div', { class: 'text-right font-medium color-success' }, formatted)
		}
	}
]

</script>

<template>
	<div>
		<span class="text-xl p-[10px]">
			Список всех марафонов
		</span>

		<base-page
			class="mt-2"
			:loading="states.loading"
			:error-text="states.errorText"
			:show-error-btn="true"
			@refresh="handleRefreshPage"
		>
			<UTable :data="data" :columns="columns" class="flex-1" />
			
		</base-page>
	</div>
</template>
