/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("orders", (table) => {
		table.uuid("id").primary();
		table.uuid("customer_id").notNullable();
		table.foreign("customer_id").references("id").inTable("customers");
		table.string("currency").notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("orders");
};
