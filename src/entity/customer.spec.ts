import { Address } from "./address";
import { Customer } from "./customer";

describe("Customer", () => {
	it("should throw error when id is empty", () => {
		expect(() => new Customer("", "John Doe")).toThrowError("Id is required");
	});

	it("should throw error when name is empty", () => {
		expect(() => new Customer("asd", "")).toThrowError("Name is required");
	});

	it("should be inactive by default", () => {
		const customer = new Customer("asd", "John Doe");

		expect(customer.isActive()).toBe(false);
	});

	it("should be active when address is set", () => {
		const customer = new Customer("asd", "John Doe");
		customer.Address = new Address("Main St", "New York", "NY", "12345");

		customer.activate();

		expect(customer.isActive()).toBe(true);
	});

	it("should throw error when activating without address", () => {
		const customer = new Customer("asd", "John Doe");

		expect(() => customer.activate()).toThrowError(
			"Address is required to activate customer",
		);
	});

	it("should be inactive when deactivated", () => {
		const customer = new Customer("asd", "John Doe");
		customer.Address = new Address("Main St", "New York", "NY", "12345");

		customer.activate();

		customer.deactivate();
		expect(customer.isActive()).toBe(false);
	});
});
