import { randomUUID } from "crypto";
import knex, { Knex } from "knex";
import { Address } from "../../domain/entity/address";
import { Customer } from "../../domain/entity/customer";
import { Currency, MoneyFormat } from "../../domain/entity/money";
import { Order } from "../../domain/entity/order";
import { OrderItem } from "../../domain/entity/order-item";
import { Product } from "../../domain/entity/product";
import { CustomerRepository } from "./customer.repository";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "./product.repository";

describe("Order Repository", () => {
	let knexInstance: Knex;
	let orderRepository: OrderRepository;

	beforeEach(async () => {
		knexInstance = knex({
			client: "better-sqlite3",
			connection: ":memory:",
			useNullAsDefault: true,
			migrations: {
				directory: "./src/infra/db/migrations",
			},
		});

		await knexInstance.migrate.latest();

		orderRepository = new OrderRepository(knexInstance);
	});

	afterEach(async () => {
		await knexInstance.destroy();
	});

	it("should create a order", async () => {
		const order = await createOrder({
			products: [{ name: "Product 1", price: "USD 100.00" }],
			customerName: "Customer 1",
			street: "street",
			city: "city",
			state: "state",
			zip: "zip",
		});

		const orders = await knexInstance.select("*").from("orders");
		const items = await knexInstance.select("*").from("order_items");

		expect(orders).toHaveLength(1);
		expect(items).toHaveLength(1);

		const [createdOrder] = orders;

		expect(createdOrder).toEqual({
			id: order.id,
			customer_id: order.customerId,
			currency: order.currency,
		});

		const [createdItem] = items;

		expect(createdItem).toEqual({
			id: order.items.at(0).id,
			order_id: order.id,
			product_id: order.items.at(0).productId,
			name: order.items.at(0).name,
			price: order.items.at(0).price.toString(),
			total: order.items.at(0).amount.toNumber(),
			quantity: 1,
		});
	});

	it("should find a order", async () => {
		const order = await createOrder({
			products: [{ name: "Product 1", price: "USD 100.00" }],
			customerName: "Customer 1",
			street: "street",
			city: "city",
			state: "state",
			zip: "zip",
		});

		const foundOrder = await orderRepository.find(order.id);

		expect(foundOrder).toEqual(order);
	});

	it("should find a order with multiple items", async () => {
		const order = await createOrder({
			products: [
				{ name: "Product 1", price: "USD 100.00" },
				{ name: "Product 2", price: "USD 200.00" },
				{ name: "Product 3", price: "USD 300.00" },
			],
			customerName: "Customer 1",
			street: "street",
			city: "city",
			state: "state",
			zip: "zip",
		});

		const foundOrder = await orderRepository.find(order.id);

		expect(foundOrder).toEqual(order);
		expect(foundOrder.items).toHaveLength(3);
	});

	it("should throw an error when order is not found", async () => {
		expect(() => orderRepository.find(randomUUID())).rejects.toThrowError(
			"Order not found",
		);
	});

	it("should find all orders", async () => {
		const order1 = await createOrder({
			products: [{ name: "Product 1", price: "USD 100.00" }],
			customerName: "Customer 1",
			street: "street",
			city: "city",
			state: "state",
			zip: "zip",
		});
		const order2 = await createOrder({
			products: [
				{ name: "Product 4", price: "USD 400.00" },
				{ name: "Product 5", price: "USD 500.00" },
				{ name: "Product 6", price: "USD 600.00" },
			],
			customerName: "Customer 2",
			street: "street",
			city: "city",
			state: "state",
			zip: "zip",
		});
		const order3 = await createOrder({
			products: [
				{ name: "Product 7", price: "USD 700.00" },
				{ name: "Product 8", price: "USD 800.00" },
				{ name: "Product 9", price: "USD 900.00" },
			],
			customerName: "Customer 3",
			street: "street",
			city: "city",
			state: "state",
			zip: "zip",
		});

		const foundOrders = await orderRepository.findAll();

		expect(foundOrders).toEqual([order1, order2, order3]);
	});

	it("should update an order", async () => {
		const order = await createOrder({
			products: [
				{ name: "Product 1", price: "USD 100.00" },
				{ name: "Product 2", price: "USD 200.00" },
				{ name: "Product 3", price: "USD 300.00" },
			],
			customerName: "Customer 1",
			street: "street",
			city: "city",
			state: "state",
			zip: "zip",
		});

		const itemId = randomUUID();

		const product = new Product(randomUUID(), "Product 4", "USD 400.00");

		await new ProductRepository(knexInstance).create(product);

		order.addItem(itemId, product, 4);

		await orderRepository.update(order);

		const orders = await knexInstance.select("*").from("orders");
		const items = await knexInstance.select("*").from("order_items");

		expect(orders).toHaveLength(1);
		expect(items).toHaveLength(4);

		const [updatedOrder] = orders;

		expect(updatedOrder).toEqual({
			id: order.id,
			customer_id: order.customerId,
			currency: order.currency,
		});

		const newItem = items.find((item) => item.id === itemId);

		expect(newItem).toEqual({
			id: itemId,
			order_id: order.id,
			product_id: product.id,
			name: "Product 4",
			price: "USD 400.00",
			total: 160000,
			quantity: 4,
		});
	});

	const createOrder = async ({
		products,
		customerName,
		street,
		city,
		state,
		zip,
	}: {
		customerName: string;
		street: string;
		city: string;
		state: string;
		zip: string;
		products: { name: string; price: MoneyFormat }[];
	}) => {
		const customerId = randomUUID();
		await new CustomerRepository(knexInstance).create(
			new Customer(
				customerId,
				customerName,
				new Address(street, city, state, zip),
			),
		);
		const orderItems = await Promise.all(
			products.map(async (product) => {
				const productEntity = new Product(
					randomUUID(),
					product.name,
					product.price,
				);
				await new ProductRepository(knexInstance).create(productEntity);
				return new OrderItem(
					randomUUID(),
					productEntity.name,
					productEntity.price.toString(),
					productEntity.id,
					1,
				);
			}),
		);

		const order = new Order(randomUUID(), customerId, orderItems, Currency.USD);

		await orderRepository.create(order);

		return order;
	};
});
