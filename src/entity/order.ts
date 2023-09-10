import { Currency, Money, MoneyFormat } from "./money";
import { OrderItem } from "./order-item";

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

	addItem(id: string, name: string, price: MoneyFormat, quantity: number) {
		const currency = price.split(" ")[0] as Currency;

		if (currency !== this._currency) {
			throw new Error("Currency mismatch");
		}

		const item = new OrderItem(id, name, price, quantity);
		this._items.push(item);
	}
}
