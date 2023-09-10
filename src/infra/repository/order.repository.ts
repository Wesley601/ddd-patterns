import { Knex } from "knex";
import { Currency, MoneyFormat } from "../../domain/entity/money";
import { Order } from "../../domain/entity/order";
import { OrderItem } from "../../domain/entity/order-item";
import { IOrderRepository } from "../../domain/repository/order.repository";
import { OrderItemTable, OrderTable } from "../db/types";

type OrderJoinOrderItem = {
	orders_id: string;
	orders_customer_id: string;
	orders_currency: string;
	order_items_id: string;
	order_items_name: string;
	order_items_price: string;
	order_items_quantity: number;
	order_items_total: number;
	order_items_product_id: string;
};

export class OrderRepository implements IOrderRepository {
	constructor(private readonly knex: Knex) {}

	async create(entity: Order): Promise<void> {
		return this.knex.transaction(async (trx) => {
			await trx
				.insert({
					id: entity.id,
					customer_id: entity.customerId,
					currency: entity.currency,
				} satisfies OrderTable)
				.into("orders");

			await trx
				.insert(
					entity.items.map(
						(item) =>
							({
								id: item.id,
								name: item.name,
								price: item.price.toString(),
								quantity: item.quantity,
								total: item.amount.toNumber(),
								order_id: entity.id,
								product_id: item.productId,
							}) satisfies OrderItemTable,
					),
				)
				.into("order_items");
		});
	}

	async update(entity: Order): Promise<void> {
		return this.knex.transaction(async (trx) => {
			await trx("orders")
				.update({
					customer_id: entity.customerId,
					currency: entity.currency,
				} satisfies Omit<OrderTable, "id">)
				.where("id", entity.id);

			await trx("order_items").where("order_id", entity.id).del();

			await trx("order_items").insert(
				entity.items.map(
					(item) =>
						({
							id: item.id,
							name: item.name,
							price: item.price.toString(),
							quantity: item.quantity,
							total: item.amount.toNumber(),
							order_id: entity.id,
							product_id: item.productId,
						}) satisfies OrderItemTable,
				),
			);
		});
	}

	async find(id: string): Promise<Order> {
		const order: OrderJoinOrderItem[] = await this.knex
			.select(
				"orders.id as orders_id",
				"orders.customer_id as orders_customer_id",
				"orders.currency as orders_currency",
				"order_items.id as order_items_id",
				"order_items.name as order_items_name",
				"order_items.price as order_items_price",
				"order_items.quantity as order_items_quantity",
				"order_items.total as order_items_total",
				"order_items.product_id as order_items_product_id",
			)
			.from("orders")
			.leftJoin("order_items", "order_items.order_id", "orders.id")
			.where("orders.id", id);

		if (!order.length) {
			throw new Error("Order not found");
		}

		const [first] = order;

		return new Order(
			first.orders_id,
			first.orders_customer_id,
			order.map(
				(item) =>
					new OrderItem(
						item.order_items_id,
						item.order_items_name,
						item.order_items_price as MoneyFormat,
						item.order_items_product_id,
						item.order_items_quantity,
					),
			),
			first.orders_currency as Currency,
		);
	}

	async findAll(): Promise<Order[]> {
		const orders: OrderTable[] = await this.knex("orders");

		if (!orders.length) {
			return [];
		}

		const items: OrderItemTable[] = await this.knex("order_items").whereIn(
			"order_id",
			orders.map((order) => order.id),
		);

		return orders.map(
			(order) =>
				new Order(
					order.id,
					order.customer_id,
					items
						.filter((item) => item.order_id === order.id)
						.map(
							(item) =>
								new OrderItem(
									item.id,
									item.name,
									item.price as MoneyFormat,
									item.product_id,
									item.quantity,
								),
						),
					order.currency as Currency,
				),
		);
	}
}
