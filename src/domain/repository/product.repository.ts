import { Product } from "../entity/product";
import { BaseRepository } from "./base.repository";

export interface IProductRepository extends BaseRepository<Product> {}
