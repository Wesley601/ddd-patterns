export class Address {
	constructor(
		private _street: string,
		private _city: string,
		private _state: string,
		private _zip: string,
	) {
		this.validate();
	}

	validate() {
		if (!this._street?.length) {
			throw new Error("Street is required");
		}

		if (!this._city?.length) {
			throw new Error("City is required");
		}

		if (!this._state?.length) {
			throw new Error("State is required");
		}

		if (!this._zip?.length) {
			throw new Error("Zip is required");
		}

		return true;
	}

	toString() {
		return `${this._street}, ${this._city}, ${this._state}, ${this._zip}`;
	}
}
