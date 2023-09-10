import { randomUUID } from "crypto";
import { Address } from "../entity/address";
import { Customer } from "../entity/customer";
import { Currency } from "../entity/money";
import { Order } from "../entity/order";
import { OrderItem } from "../entity/order-item";
import { Product } from "../entity/product";
import { OrderService } from "./order.service";

describe("Order Service", () => {
	it("should place an order", () => {
		const customer = new Customer("c1", "customer 1");
		customer.Address = new Address("M", "New York", "NY", "12324");
		customer.activate();

		const orderItem1 = assembleOrderItem(
			new Product("p1", "product 1", "USD 100.00"),
			1,
		);

		const orderItem2 = assembleOrderItem(
			new Product("p2", "product 2", "USD 200.00"),
			2,
		);

		const orderItem3 = assembleOrderItem(
			new Product("p3", "product 3", "USD 300.00"),
			3,
		);

		const order = OrderService.placeOrder(customer, Currency.USD, [
			orderItem1,
			orderItem2,
			orderItem3,
		]);

		expect(customer.rewardPoints.points).toBe(700);
		expect(order.total.toString()).toBe("USD 1400.00");
	});

	it("should get total of all orders", () => {
		const customer = new Customer("c1", "customer 1");

		const order = new Order("o1", customer.id);
		order.addItem("oi1", new Product("p1", "product 1", "USD 100.00"), 1);
		order.addItem("oi2", new Product("p2", "product 2", "USD 200.00"), 2);
		order.addItem("oi3", new Product("p3", "product 3", "USD 300.00"), 3);

		const order2 = new Order("o2", customer.id);
		order2.addItem("oi4", new Product("p4", "product 4", "USD 400.00"), 4);
		order2.addItem("oi5", new Product("p5", "product 5", "USD 500.00"), 5);
		order2.addItem("oi6", new Product("p6", "product 6", "USD 600.00"), 6);

		const order3 = new Order("o3", customer.id);
		order3.addItem("oi7", new Product("p7", "product 7", "USD 700.00"), 7);
		order3.addItem("oi8", new Product("p8", "product 8", "USD 800.00"), 8);
		order3.addItem("oi9", new Product("p9", "product 9", "USD 900.00"), 9);

		expect(OrderService.getTotal([order, order2, order3]).toString()).toBe(
			"USD 28500.00",
		);
	});

	it("should get total from one order", () => {
		const customer = new Customer("c1", "customer 1");

		const order = new Order("o1", customer.id);
		order.addItem("oi1", new Product("p1", "product 1", "USD 100.00"), 1);
		order.addItem("oi2", new Product("p2", "product 2", "USD 200.00"), 2);
		order.addItem("oi3", new Product("p3", "product 3", "USD 300.00"), 3);

		expect(OrderService.getTotal([order]).toString()).toBe("USD 1400.00");
	});

	it("should get total from empty orders", () => {
		expect(OrderService.getTotal([]).toString()).toBe("USD 0.00");
	});

	it("should get total from one order with no items", () => {
		const customer = new Customer("c1", "customer 1");

		const order = new Order("o1", customer.id);

		expect(OrderService.getTotal([order]).toString()).toBe("USD 0.00");
	});
});

const assembleOrderItem = (product: Product, quantity: number) => {
	return new OrderItem(
		randomUUID(),
		product.name,
		product.price.toString(),
		product.id,
		quantity,
	);
};
