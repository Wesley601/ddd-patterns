import { Product } from "../entity/product";
import { ProductService } from "./product.service";

describe("Product Service", () => {
	it("should change the prices of all products", () => {
		const product = new Product("p1", "product 1", "USD 100.00");
		const product2 = new Product("p2", "product 2", "USD 200.00");
		const product3 = new Product("p3", "product 3", "USD 300.00");

		ProductService.increasePrice([product, product2, product3], 10);

		expect(product.price.toString()).toBe("USD 110.00");
		expect(product2.price.toString()).toBe("USD 220.00");
		expect(product3.price.toString()).toBe("USD 330.00");
	});
});
