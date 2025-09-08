import type { IStore } from "~/types/store";

export default function () {
	return useState<IStore>('base-store', () => {
		return {
			email: null,
			isValidateEmail: false,
			username: null,
			name: null,
			phone: null,
			birthdate: null,
			weight: null,
			height: null,
		}
	});
}
