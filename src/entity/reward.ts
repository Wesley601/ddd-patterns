export class Reward {
	constructor(private _points: number) {
		this._points = _points;
		this.validate();
	}

	validate() {
		if (this._points < 0) {
			throw new Error("Points must be greater than 0");
		}
	}

	get points() {
		return this._points;
	}

	increase(points: number) {
		this._points += points;
	}
}
