import { Order } from "../entity/order";
import { BaseRepository } from "./base.repository";

export interface IOrderRepository extends BaseRepository<Order> {}
