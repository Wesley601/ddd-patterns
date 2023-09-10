import { Knex } from "knex";
import { Product } from "../../domain/entity/product";
import { IProductRepository } from "../../domain/repository/product.repository";
import { ProductTable } from "../db/types";

export class ProductRepository implements IProductRepository {
	constructor(private readonly knex: Knex) {}

	async create(entity: Product): Promise<void> {
		return this.knex
			.insert({
				id: entity.id,
				name: entity.name,
				price: entity.price.toString(),
			} satisfies ProductTable)
			.into("products");
	}

	update(entity: Product): Promise<void> {
		return this.knex("products")
			.where({ id: entity.id })
			.update({
				name: entity.name,
				price: entity.price.toString(),
			} satisfies Omit<ProductTable, "id">);
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
			.then((rows: ProductTable[]) =>
				rows.map((row) => new Product(row.id, row.name, row.price)),
			);
	}
}
