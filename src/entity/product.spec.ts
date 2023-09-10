import { Currency, Money } from "./money";
import { Product } from "./product";

describe("Product", () => {
	it("should throw error when id is empty", () => {
		expect(() => new Product("", "product 1", "USD 100.00")).toThrowError(
			"Id is required",
		);
	});

	it("should throw error when name is empty", () => {
		expect(() => new Product("p1", "", "USD 100.00")).toThrowError(
			"Name is required",
		);
	});

	it("should throw error when price is negative", () => {
		expect(() => new Product("p1", "", "USD -100.00")).toThrowError(
			"amount must be greater than 0",
		);
	});

	it("should be able to change the product price", () => {
		const product = new Product("p1", "product 1", "USD 100.00");

		product.changePrice("USD 200.00");
		expect(product.price.toString()).toBe("USD 200.00");

		product.changePrice(new Money(Currency.USD, 30000));
		expect(product.price.toString()).toBe("USD 300.00");
	});
});
