import { Product } from "../entity/product";

export class ProductService {
	static increasePrice(products: Product[], percentage: number) {
		products.forEach((product) => product.addPercentage(percentage));
	}
}
