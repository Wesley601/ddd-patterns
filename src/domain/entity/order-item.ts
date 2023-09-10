import { Money, MoneyFormat } from "./money";

export class OrderItem {
	private _price: Money;

	constructor(
		private _id: string,
		private _name: string,
		price: MoneyFormat,
		private _productId: string,
		private _quantity: number,
	) {
		this._price = Money.fromString(price);
		this.validate();
	}

	validate() {
		if (!this._id?.length) {
			throw new Error("Id is required");
		}

		if (!this._name?.length) {
			throw new Error("Order is required");
		}

		if (this._quantity < 1) {
			throw new Error("Quantity must be greater than 0");
		}
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get price() {
		return this._price;
	}

	get quantity() {
		return this._quantity;
	}

	get productId() {
		return this._productId;
	}

	get amount() {
		return new Money(
			this._price.currency,
			this._price.toNumber() * this._quantity,
		);
	}
}
