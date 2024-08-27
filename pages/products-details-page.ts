import { expect, Locator, Page } from "@playwright/test";
import { Review } from "../model/review";
import { boxedStep } from "../util/boxed-step";
import { Product } from "../model/product";
import { log } from "console";
import { throwOnNull } from "../util/validators";
import { parsePrice, parseRatingsCount } from "../util/parsers";

export class ProductDetailsPage {
    private readonly productInfoContainer: Locator;

    private readonly productNameLocator: Locator;
    private readonly priceLocator: Locator;
    private readonly nonEmptyRatingsContainer: Locator;
    private readonly ratingsCountLocator: Locator;
    private readonly avgRatingLocator: Locator;

    private readonly tabsContainer: Locator;

    constructor(private readonly page: Page) {
        this.productInfoContainer = page.locator('.product-info-main')

        this.productNameLocator = this.productInfoContainer.locator('.page-title');
        this.priceLocator = this.productInfoContainer.locator('.product-info-price .price');
        this.nonEmptyRatingsContainer = this.productInfoContainer.locator('.product-reviews-summary:not(.empty)');
        this.ratingsCountLocator = this.nonEmptyRatingsContainer.locator('.reviews-actions');
        this.avgRatingLocator = this.nonEmptyRatingsContainer.locator('.rating-result');

        this.tabsContainer = page.getByRole('main').getByRole('tablist');
    }

    @boxedStep
    private async openReviewsTab() {
        while( ! await this.reviewsTabOpen() ) { 
            await this.page.locator('#tab-label-reviews').click();
        }
    }

    private async reviewsTabOpen(): Promise<boolean> {
        // TODO: extract to fields
        return this.tabsContainer.getByTestId('nickname_field').isVisible();
    }

    @boxedStep
    async addReview(review: Review) {
        await this.openReviewsTab();
        const ratingLabel = this.page.getByTestId(ProductDetailsPage.getTestId(review.rating));
        const ratingLabelBoundingBox = await ratingLabel.boundingBox()
            .then( box => throwOnNull(box));

        // click on star corresponding to rating
        const ratingClickPosition = {
            x: ratingLabelBoundingBox.width - ratingLabelBoundingBox.height/2,
            y: ratingLabelBoundingBox.height/2 
        }
        await ratingLabel.click({position: ratingClickPosition});

        // firefox seems to clear fields for some reason
        await expect( async () => {
            await this.tabsContainer.getByTestId('nickname_field').fill(review.nickname);
            await this.tabsContainer.getByTestId('summary_field').fill(review.summary);
            await this.tabsContainer.getByTestId('review_field').fill(review.content);
            //expect(await this.areReviewFieldsFilled()).toBeTruthy();
            await this.tabsContainer.locator('button[type="submit"]').click()
            // make sure that there is no error messages related to fields
            await expect(this.tabsContainer.locator(".mage-error")).not.toBeAttached()
            .catch( (reason) => {
                log('Repeating, because: ' + reason);
                throw new Error(reason);
            })
        }).toPass();
    }
    
    @boxedStep
    async getProductData(): Promise<Product> {
        const name = (await this.productNameLocator.textContent())?.trim() ?? '';
        const price = await this.priceLocator.textContent().then(parsePrice)
        let ratingsCount: number;
        let avgRating: number;

        if( await this.nonEmptyRatingsContainer.isVisible()) {
            ratingsCount = parseRatingsCount(await this.ratingsCountLocator.textContent());
            avgRating = await this.avgRatingLocator.getAttribute('title')
                .then(s => Number.parseFloat(s ?? 'NaN'));
        } else {
            ratingsCount = 0;
            avgRating = NaN;
        }
        return new Product(name, price, ratingsCount, avgRating);
    }

    private static getTestId(rating: Review.Rating) {
        return 'Rating_' + rating  + '_label';
    }

    // TODO: make this into type
    // FIXME: make this return {content: string, status: 'success' | 'notice' | 'error'} type
    @boxedStep
    private async getMessages() :Promise<{content: string, status: string}[]> {
        const messagesLocator = this.page.getByRole('main').getByRole('alert').locator('.message');
        await messagesLocator.first().waitFor({state: 'visible'});
        const messages: {content: string, status: string}[] = [];
        for( const messageLocator of await messagesLocator.all() ) {
            const message = {
                // FIXME make it so that || '' is unnecessary (hacky solution)
                content: await messageLocator.textContent() || '',
                // FIXME (does it handle null correctly?)
                // TODO refactor into readable form
                // FIXME make it so that || 'error' is unnecessary (hacky solution)
                status: await messageLocator.getAttribute('class').then( s => s?.split(' ').find(v => v.match(/^message-/))?.split(/^message-/)[1]) || 'error'
            }
            messages.push(message);
        }
        return messages;
    }

    @boxedStep
    async reviewAddedSuccesfully(): Promise<boolean> {
        return (await this.getMessages()).find( message => message.status === 'success') !== undefined;
        //return this.page.getByRole('alert').locator('.message-success').isVisible();
    }
}