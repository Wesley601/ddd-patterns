import { randomUUID } from "crypto";
import knex, { Knex } from "knex";
import { Address } from "../../domain/entity/address";
import { Customer } from "../../domain/entity/customer";
import { CustomerRepository } from "./customer.repository";

describe("Customer Repository", () => {
	let knexInstance: Knex;
	let customerRepository: CustomerRepository;

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

		customerRepository = new CustomerRepository(knexInstance);
	});

	afterEach(async () => {
		await knexInstance.destroy();
	});

	it("should create a customer", async () => {
		const customer = new Customer(
			randomUUID(),
			"Customer 1",
			new Address("street", "city", "state", "zip"),
		);

		await customerRepository.create(customer);

		const customers = await knexInstance.select("*").from("customers");

		expect(customers).toHaveLength(1);

		const [createdCustomer] = customers;

		expect({
			...createdCustomer,
			active: !!createdCustomer.active,
		}).toEqual({
			id: customer.id,
			name: customer.name,
			street: customer.address.street,
			state: customer.address.state,
			zip_code: customer.address.zip,
			city: customer.address.city,
			active: customer.isActive(),
			reward_points: customer.rewardPoints.points,
		});
	});

	it("should update a customer", async () => {
		const customer = new Customer(
			randomUUID(),
			"Customer 1",
			new Address("street", "city", "state", "zip"),
		);
		await customerRepository.create(customer);

		customer.rewardPoints.increase(100);

		await customerRepository.update(customer);

		const customers = await knexInstance.select("*").from("customers");
		expect(customers).toHaveLength(1);

		const [updatedCustomer] = customers;

		expect(updatedCustomer.reward_points).toEqual(100);
	});

	it("should find a customer", async () => {
		const customer = new Customer(
			randomUUID(),
			"Customer 1",
			new Address("street", "city", "state", "zip"),
		);

		await customerRepository.create(customer);

		const foundCustomer = await customerRepository.find(customer.id);

		expect(foundCustomer).toEqual(customer);
	});

	it("should throw an error when customer is not found", async () => {
		expect(() => customerRepository.find(randomUUID())).rejects.toThrowError(
			"Customer not found",
		);
	});

	it("should find all customers", async () => {
		const customer1 = new Customer(
			randomUUID(),
			"Customer 1",
			new Address("street1", "city1", "state1", "zip1"),
		);
		const customer2 = new Customer(
			randomUUID(),
			"Customer 2",
			new Address("street2", "city2", "state2", "zip2"),
		);
		const customer3 = new Customer(
			randomUUID(),
			"Customer 3",
			new Address("street3", "city3", "state3", "zip3"),
		);
		await customerRepository.create(customer1);
		await customerRepository.create(customer2);
		await customerRepository.create(customer3);
		const foundCustomers = await customerRepository.findAll();
		expect(foundCustomers).toEqual([customer1, customer2, customer3]);
	});
});
