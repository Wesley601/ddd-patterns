import { Currency, Money, MoneyFormat } from "./money";
import { OrderItem } from "./order-item";
import { Product } from "./product";

export class Order {
	constructor(
		private _id: string,
		private _customerId: string,
		private _items: OrderItem[] = [],
		private _currency: Currency = Currency.USD,
	) {
		this.validate();
	}

	validate() {
		if (!this._id?.length) {
			throw new Error("Id is required");
		}

		if (!this._customerId?.length) {
			throw new Error("Customer is required");
		}

		if (this._items?.some((item) => item.price.currency !== this._currency)) {
			throw new Error("Currency mismatch");
		}
	}

	get id() {
		return this._id;
	}

	get total() {
		if (!this._items.length) {
			return new Money(this._currency, "0.00");
		}

		return this._items.reduce(
			(acc, item) => item.amount.add(acc),
			new Money(this._currency, "0.00"),
		);
	}

	addItem(id: string, product: Product, quantity: number) {
		const item = new OrderItem(
			id,
			product.name,
			product.price.toString(),
			product.id,
			quantity,
		);
		this._items.push(item);
	}
}
