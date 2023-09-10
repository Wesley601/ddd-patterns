import { Currency, Money, MoneyFormat } from "./money";

export class Product {
	private _price: Money;
	constructor(
		private readonly _id: string,
		private _name: string,
		price: MoneyFormat,
	) {
		this._price = Money.fromString(price);
		this.validate();
	}

	validate() {
		if (!this._id.length) {
			throw new Error("Id is required");
		}

		if (!this._name.length) {
			throw new Error("Name is required");
		}

		return true;
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

	changeName(value: string) {
		if (!value.length) {
			throw new Error("Name is required");
		}

		this._name = value;
	}

	changePrice(value: MoneyFormat | Money) {
		if (typeof value === "string") {
			this._price = Money.fromString(value);
		}

		if (value instanceof Money) {
			this._price = value;
		}
	}

	addPercentage(percentage: number) {
		this._price = this._price.addPercentage(percentage);
	}
}
