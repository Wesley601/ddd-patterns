import { Order } from "./order";

describe("order", () => {
	it("should throw error when id is empty", () => {
		expect(() => new Order("", "c1")).toThrowError("Id is required");
	});

	it("should throw error when customerId is empty", () => {
		expect(() => new Order("asd", "")).toThrowError("Customer is required");
	});

	it("should return total 0 when no items", () => {
		const order = new Order("o1", "c1");

		expect(order.total.amount).toBe("0.00");
	});

	it("should return total price of items", () => {
		const order = new Order("o1", "c1");
		order.addItem("i1", "Item 1", "USD 10.00", 1);
		order.addItem("i2", "Item 2", "USD 20.00", 2);

		expect(order.total.toString()).toBe("USD 50.00");
	});
});
