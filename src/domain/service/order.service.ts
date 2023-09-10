import { randomUUID } from "crypto";
import { Customer } from "../entity/customer";
import { Currency, Money } from "../entity/money";
import { Order } from "../entity/order";
import { OrderItem } from "../entity/order-item";

export class OrderService {
	static getTotal(orders: Order[]) {
		if (!orders.length) {
			return new Money(Currency.USD, "0.00");
		}

		const [firstOrder, ...rest] = orders;

		return rest.reduce((acc, item) => acc.add(item.total), firstOrder.total);
	}

	static placeOrder(
		customer: Customer,
		currency: Currency,
		items: OrderItem[],
	) {
		if (!customer.isActive()) {
			throw new Error("Customer is not active");
		}

		if (!items.length) {
			throw new Error("Order must have at least one item");
		}

		const order = new Order(randomUUID(), customer.id, items, currency);

		customer.addRewardPoints(order.total);

		return order;
	}
}
