import { Knex } from "knex";
import { Address } from "../../domain/entity/address";
import { Customer } from "../../domain/entity/customer";
import { Reward } from "../../domain/entity/reward";
import { ICustomerRepository } from "../../domain/repository/customer.repository";
import { CustomerTable } from "../db/types";

export class CustomerRepository implements ICustomerRepository {
	constructor(private readonly knex: Knex) {}

	async create(entity: Customer): Promise<void> {
		return this.knex
			.insert({
				id: entity.id,
				name: entity.name,
				active: entity.isActive(),
				city: entity.address.city,
				state: entity.address.state,
				street: entity.address.street,
				zip_code: entity.address.zip,
				reward_points: entity.rewardPoints.points,
			} satisfies CustomerTable)
			.into("customers");
	}

	update(entity: Customer): Promise<void> {
		return this.knex("customers")
			.where({ id: entity.id })
			.update({
				name: entity.name,
				active: entity.isActive(),
				city: entity.address.city,
				state: entity.address.state,
				street: entity.address.street,
				zip_code: entity.address.zip,
				reward_points: entity.rewardPoints.points,
			} satisfies Omit<CustomerTable, "id">);
	}

	async find(id: string): Promise<Customer> {
		const row = await this.knex
			.select("*")
			.from("customers")
			.where({ id })
			.first();

		if (!row) {
			throw new Error("Customer not found");
		}

		return this.assembleCustomer(row);
	}

	async findAll(): Promise<Customer[]> {
		return this.knex
			.select("*")
			.from("customers")
			.then((rows) => rows.map(this.assembleCustomer));
	}

	private assembleCustomer(row: CustomerTable): Customer {
		return new Customer(
			row.id,
			row.name,
			new Address(row.street, row.city, row.state, row.zip_code),
			!!row.active,
			new Reward(row.reward_points),
		);
	}
}
