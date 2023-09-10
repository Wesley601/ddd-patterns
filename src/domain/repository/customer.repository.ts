import { Customer } from "../entity/customer";
import { BaseRepository } from "./base.repository";

export interface ICustomerRepository extends BaseRepository<Customer> {}
