
export class Product {
    // TODO: need to create class representing instance of product (concrete product that can be added to cart (in contrast to general product that have many possible colors, etc))??
    public name: string;
    public price: number;
    public ratingsCount: number;
    public avgRating: number;

    constructor(name: string, price: number, ratingsCount: number, avgRating: number) {
        this.name = name;
        this.price = price;
        this.ratingsCount = ratingsCount;
        this.avgRating = avgRating;
    }
}