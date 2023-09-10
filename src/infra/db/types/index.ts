import { MoneyFormat } from "../../../domain/entity/money";

export type ProductTable = {
	id: string;
	name: string;
	price: MoneyFormat;
};

export type CustomerTable = {
	id: string;
	name: string;
	street: string;
	state: string;
	zip_code: string;
	city: string;
	active: boolean;
	reward_points: number;
};
