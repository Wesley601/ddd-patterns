import { randomUUID } from "crypto";

import { Address } from "./domain/entity/address";
import { Customer } from "./domain/entity/customer";
import { Order } from "./domain/entity/order";
import { OrderItem } from "./domain/entity/order-item";

const customer = new Customer("1", "John Doe");
const address = new Address("123 Main St", "New York", "NY", "10001");
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "Product 1", "USD 90.90", 1);
const item2 = new OrderItem("1", "Product 1", "USD 99.90", 1);

const order = new Order("1", customer.id, [item1, item2]);
