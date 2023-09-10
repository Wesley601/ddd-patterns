// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		useNullAsDefault: true,
		client: "better-sqlite3",
		connection: {
			filename: "./dev.sqlite3",
		},
		migrations: {
			directory: "./src/infra/db/migrations",
		},
	},
};
