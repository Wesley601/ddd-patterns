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

export type OrderTable = {
	id: string;
	customer_id: string;
	currency: string;
};

export type OrderItemTable = {
	id: string;
	name: string;
	price: string;
	quantity: number;
	total: number;
	order_id: string;
	product_id: string;
};
