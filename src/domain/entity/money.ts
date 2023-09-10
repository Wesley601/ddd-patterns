export enum Currency {
	USD = "USD",
	EUR = "EUR",
	GBP = "GBP",
}

export type MoneyFormat = `${Currency} ${string}`;

export class Money {
	private readonly _amount: number;

	constructor(private readonly _currency: Currency, amount: string | number) {
		if (typeof amount === "number") {
			this._amount = amount;
		}

		if (typeof amount === "string") {
			this._amount = Money.amountToNumber(amount);
		}

		this.validate();
	}

	get currency() {
		return this._currency;
	}

	get amount() {
		const amount = this._amount;
		return (amount / 100).toFixed(2);
	}

	validate() {
		if (!this._currency) {
			throw new Error("Currency is required");
		}
	}

	add(money: Money) {
		if (this._currency !== money.currency) {
			throw new Error("Currency mismatch");
		}

		return new Money(this._currency, this._amount + money.toNumber());
	}

	addPercentage(percentage: number) {
		if (percentage < 0) {
			throw new Error("Percentage must be greater than 0");
		}

		return new Money(this._currency, this._amount * (1 + percentage / 100));
	}

	subtract(money: Money) {
		if (this._currency !== money.currency) {
			throw new Error("Currency mismatch");
		}

		return new Money(this._currency, this._amount - money.toNumber());
	}

	equals(money: Money) {
		return this.toString() === money.amount.toString();
	}

	greaterThan(money: Money) {
		if (this._currency !== money.currency) {
			throw new Error("Currency mismatch");
		}

		return this._amount > money.toNumber();
	}

	lessThan(money: Money) {
		if (this._currency !== money.currency) {
			throw new Error("Currency mismatch");
		}

		return this._amount < money.toNumber();
	}

	toString(): MoneyFormat {
		return `${this._currency} ${this.amount}`;
	}

	toNumber() {
		return this._amount;
	}

	toObject() {
		return {
			currency: this._currency,
			amount: this._amount,
		};
	}

	static fromString(value: MoneyFormat) {
		const [currency, amount] = value.split(" ");
		if (!Object.values(Currency).includes(currency as Currency)) {
			throw new Error("Currency not supported");
		}

		if (isNaN(parseFloat(amount))) {
			throw new Error("amount must be a decimal value");
		}

		return new Money(currency as Currency, amount);
	}

	static amountToNumber(value: string) {
		const amount = parseFloat(value);

		if (isNaN(amount)) {
			throw new Error("amount must be a decimal value");
		}

		if (amount < 0) {
			throw new Error("amount must be greater than 0");
		}

		return amount * 100;
	}
}
