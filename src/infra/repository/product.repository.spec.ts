import { randomUUID } from "crypto";
import knex, { Knex } from "knex";
import { Product } from "../../domain/entity/product";
import { ProductRepository } from "./product.repository";

describe("Product Repository", () => {
	let knexInstance: Knex;
	let productRepository: ProductRepository;

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

		productRepository = new ProductRepository(knexInstance);
	});

	afterEach(async () => {
		await knexInstance.destroy();
	});

	it("should create a product", async () => {
		const product = new Product(randomUUID(), "Product 1", "USD 100.00");

		await productRepository.create(product);

		const products = await knexInstance.select("*").from("products");

		expect(products).toHaveLength(1);

		const [createdProduct] = products;

		expect(createdProduct).toEqual({
			id: product.id,
			name: product.name,
			price: product.price.toString(),
		});
	});

	it("should update a product", async () => {
		const product = new Product(randomUUID(), "Product 1", "USD 100.00");

		await productRepository.create(product);

		product.changeName("Product 2");

		await productRepository.update(product);

		const products = await knexInstance.select("*").from("products");

		expect(products).toHaveLength(1);

		const [updatedProduct] = products;

		expect(updatedProduct).toEqual({
			id: product.id,
			name: "Product 2",
			price: product.price.toString(),
		});
	});

	it("should find a product", async () => {
		const product = new Product(randomUUID(), "Product 1", "USD 100.00");

		await productRepository.create(product);

		const foundProduct = await productRepository.find(product.id);

		expect(foundProduct).toEqual(product);
	});

	it("should throw an error when product is not found", async () => {
		expect(() => productRepository.find(randomUUID())).rejects.toThrowError(
			"Product not found",
		);
	});

	it("should find all products", async () => {
		const product1 = new Product(randomUUID(), "Product 1", "USD 100.00");
		const product2 = new Product(randomUUID(), "Product 2", "USD 200.00");
		const product3 = new Product(randomUUID(), "Product 3", "USD 300.00");

		await productRepository.create(product1);
		await productRepository.create(product2);
		await productRepository.create(product3);

		const foundProducts = await productRepository.findAll();

		expect(foundProducts).toEqual([product1, product2, product3]);
	});
});
