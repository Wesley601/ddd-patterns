/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("order_items", (table) => {
		table.uuid("id").primary();
		table.string("name").notNullable();
		table.string("price").notNullable();
		table.integer("quantity").unsigned().notNullable();
		table.integer("total").unsigned().notNullable();
		table.uuid("order_id").unsigned().notNullable();
		table.foreign("order_id").references("id").inTable("orders");
		table.uuid("product_id").unsigned().notNullable();
		table.foreign("product_id").references("id").inTable("products");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("order_items");
};
