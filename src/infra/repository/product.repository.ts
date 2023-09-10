import { Knex } from "knex";
import { Product } from "../../domain/entity/product";
import { BaseRepository } from "../../domain/repository/base.repository";

export class ProductRepository implements BaseRepository<Product> {
	constructor(private readonly knex: Knex) {}

	async create(entity: Product): Promise<void> {
		return this.knex
			.insert({
				id: entity.id,
				name: entity.name,
				price: entity.price.toString(),
			})
			.into("products");
	}

	update(entity: Product): Promise<void> {
		return this.knex("products").where({ id: entity.id }).update({
			name: entity.name,
			price: entity.price.toString(),
		});
	}

	async find(id: string): Promise<Product> {
		const row = await this.knex
			.select("*")
			.from("products")
			.where({ id })
			.first();

		if (!row) {
			throw new Error("Product not found");
		}

		return new Product(row.id, row.name, row.price);
	}

	async findAll(): Promise<Product[]> {
		return this.knex
			.select("*")
			.from("products")
			.then((rows) =>
				rows.map((row) => new Product(row.id, row.name, row.price)),
			);
	}
}
