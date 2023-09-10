/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("customers", (table) => {
		table.uuid("id").primary();
		table.string("name").notNullable();
		table.string("street").notNullable();
		table.string("state").notNullable();
		table.string("zip_code").notNullable();
		table.string("city").notNullable();
		table.boolean("active").defaultTo(false);
		table.integer("reward_points").notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("customers");
};
