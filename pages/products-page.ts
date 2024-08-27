import { Locator, Page } from "@playwright/test";
import { boxedStep } from "../util/boxed-step";
import { ProductDetailsPage } from "../pages/products-details-page";
import { Product } from "../model/product";
import { parsePrice, parseRatingsCount } from "../util/parsers";

export class ProductsPage {
    private readonly productElements: Locator;
    private readonly cartWrapper: Locator;
    private readonly cartToggleButton: Locator;
    private readonly cartContentWrapper: Locator;
    private readonly cartProductWrappers: Locator;

    constructor(private readonly page: Page) {
        this.productElements = page.getByRole('main').getByRole('list').locator('.product-item');
        this.cartWrapper = this.page.locator('.page-header [data-block="minicart"]');
        this.cartToggleButton = this.cartWrapper.getByRole('link', { name: 'My Cart' });
        this.cartContentWrapper = this.cartWrapper.getByTestId('minicart-content-wrapper');
        this.cartProductWrappers = this.cartContentWrapper.locator('[data-role="product-item"]');
    }

    async goto() {
        // TODO: figure out how to choose category
        // use either overloaded method or enum
        await this.page.goto('https://magento.softwaretestingboard.com/women/tops-women.html');
    }

    @boxedStep
    async getProductNames(): Promise<string[]> {
        return this.productElements.locator('.product-item-link').allInnerTexts();
    }

    @boxedStep
    async getProducts(): Promise<Product[]> {
        const result: Product[] = [];
        for( const product of await this.productElements.all() ) {
            await product.waitFor({state: 'visible'})
        }
        for(const productCardLocator of await this.productElements.all()) {
            result.push(await this.getProductFromProductCard(productCardLocator));
        }
        return result;
    }

    @boxedStep
    private async getProductFromProductCard(productCard: Locator) {
        // TODO: maybe create ProductCard component
        const name = (await productCard.locator('.product-item-link').textContent())?.trim() ?? '';
        const price = await productCard.locator('.price-container .price').textContent().then(parsePrice);
        let ratingsCount: number;
        let avgRating: number;

        if (await productCard.locator('.reviews-actions').isVisible()) {
            ratingsCount = await productCard.locator('.reviews-actions').textContent().then(parseRatingsCount)
            avgRating = await productCard.locator('.rating-result').getAttribute('title')
                .then(s => Number.parseFloat(s ?? 'NaN'));
        } else {
            ratingsCount = 0;
            avgRating = NaN;
        }
        return new Product( name, price, ratingsCount, avgRating );
    }

    @boxedStep
    public async addProductToCart(product: Product) {
        // TODO add option to select specific color / size
        const productLocator = await this.findProductWrapperLocator(product);
        const addToCartButton = productLocator.getByRole('button', {'name': 'Add to Cart'});
        await productLocator.locator('[data-role^="swatch-option"] [aria-label="Size"] [option-label]').first().click()
        await productLocator.locator('[data-role^="swatch-option"] [aria-label="Color"] [option-label]').first().click()
        await addToCartButton.click();
        await this.waitForCartToUpdate();
    }

    @boxedStep
    public async removeFromCart(product: Product) {
        await this.withShoppingCartOpen( async () => {
            await this.cartProductWrappers.first().waitFor({state: 'visible'});
            const productToRemove = this.cartProductWrappers.filter({hasText: product.name});
            await productToRemove.getByRole('link', { name: 'Remove' }).click();
            await this.page.getByRole('dialog').getByRole('button', {name: 'OK'}).click();
            await productToRemove.waitFor({state: "detached"});
        })
    }

    /**
     * @param doQuickCheck quick check reads product count from badge near shopping cart icon,
     * if false, check count by opening shopping cart and summing products
     * @returns 
     */
    @boxedStep
    public async getProductsInCartCount(doQuickCheck: boolean = true): Promise<number> {
        if(doQuickCheck) {
            return await this.cartWrapper.locator('.counter-number').textContent({timeout: 1000}).then( numberAsText => Number.parseInt(numberAsText ?? '0'));
        } else {
            return await this.withShoppingCartOpen( async () => {
                return await this.cartProductWrappers.count();
            })
        }
    }

    /**
     * @param doQuickCheck quick check reads product count from badge near shopping cart icon,
     * if false, check emptiness by opening shopping cart and looking for products
     * @returns 
     */
    @boxedStep
    public async isCartEmpty(doQuickCheck: boolean = true): Promise<boolean> {
        return await this.getProductsInCartCount(doQuickCheck).then(count => count === 0);
    }

    /**
     * Get array of names of items in cart
     * Preserves cart state (if it was open before call, it will be open after)
     */
    @boxedStep
    public async getCartContents(): Promise<Set<string>> {
        // TODO: change return type into Product
        // TODO: do I need to open cart for this
        return await this.withShoppingCartOpen( async () => {
            const productsInCart: Set<string> = new Set();
            await this.cartProductWrappers.first().waitFor({state: 'visible'});
            for( const cartProductWrapper of await this.cartProductWrappers.all() ) {
                productsInCart.add(await this.getProductFromCartItem(cartProductWrapper));
            }
            return productsInCart;
        })
    }

    /**
     * execute action with contents of shopping cart while preserving it's state
     * (if it's open it will remain open, if closed, it will be closed)
     * @param action action to execute with open shopping cart
     * @returns 
     */
    private async withShoppingCartOpen<T>( action: () => T ):  Promise<T> {
        const cardOpenedBefore = await this.isCartOpen();
        if(!cardOpenedBefore) {
            await this.openCart();
        }

        const result: T = await action();

        if(!cardOpenedBefore) {
            await this.closeCart();
        }

        return result;
    }
    
    @boxedStep
    private async getProductFromCartItem(cartProductWrapper: Locator): Promise<string> {
        return await cartProductWrapper.locator('.product-item-name').textContent().then( (name) => {
            if(!name) {
                throw new Error('Product name is null');
            }
            return name.trim();
        });
    }

    @boxedStep
    public async openCart() {
        if( ! await this.isCartOpen() ) {
            await this.waitForCartToUpdate();
            await this.cartToggleButton.click();
        }
    }

    @boxedStep
    public async closeCart() {
        if( await this.isCartOpen() ) {
            await this.waitForCartToUpdate();
            await this.cartToggleButton.click();
        }
    }
    
    @boxedStep
    private async waitForCartToUpdate() {
        await this.cartToggleButton.locator('.loader').waitFor({state: 'detached'});
    }

    @boxedStep
    private async isCartOpen() {
        return await this.cartContentWrapper.isVisible();
    }

    private async findProductWrapperLocator(product: Product) {
        return this.productElements.filter({hasText: product.name});
    }

    @boxedStep
    async gotoProductDetails(productName: string) : Promise<ProductDetailsPage> {
        await this.productElements
            .locator('.product-item-link')
            .filter({hasText: productName})
            .click();
        return new ProductDetailsPage(this.page);
    }
}