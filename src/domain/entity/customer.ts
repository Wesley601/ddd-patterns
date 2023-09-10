import { Address } from "./address";
import { Money } from "./money";
import { Reward } from "./reward";

const REWARD_POINTS_PER_CENT = 200;

export class Customer {
	constructor(
		private _id: string,
		private _name: string,
		private _address?: Address,
		private _active = false,
		private _rewardPoints = new Reward(0),
	) {
		this.validate();
	}

	validate() {
		if (!this._id?.length) {
			throw new Error("Id is required");
		}

		if (!this._name?.length) {
			throw new Error("Name is required");
		}
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get address() {
		return this._address;
	}

	get rewardPoints() {
		return this._rewardPoints;
	}

	set Address(value: Address) {
		this._address = value;
	}

	isActive() {
		return this._active;
	}

	activate() {
		if (!this._address) {
			throw new Error("Address is required to activate customer");
		}

		this._active = true;
	}

	deactivate() {
		this._active = false;
	}

	addRewardPoints(total: Money) {
		this._rewardPoints.increase(total.toNumber() / REWARD_POINTS_PER_CENT);
	}
}
