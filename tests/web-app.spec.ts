import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ProductsPage } from '../pages/products-page';
import { getRandomElement, getRandomElements } from '../util/random-helpers';
import { Review } from '../model/review';


test('product search', async({page}) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  // TODO check if open
  await homePage.searchProduct('bag');

  //await expect(page.locator('.products.list .product-item')).toHaveCount(1);
  await expect.poll(async () => page.locator('.products.list .product-item').count()).toBeGreaterThan(1);
});


/*
## HL003	Adding and removing items from shopping cart:
Preconditions:
1. Open https://magento.softwaretestingboard.com/men/tops-men.html

Steps:
1. Add two random items to the shopping cart, selecting first available size and color
   Result: There should appear information that the product was added to the shopping card after each addition
2. Click on the shopping cart icon
   Result: Shopping cart popup should appear, showing two added products
3. Remove each item from shopping cart
   Result: Shopping cart should be empty
*/
test('adding and removing items from shopping cart', async({page}) => {
  const productsPage = new ProductsPage(page);
  await productsPage.goto();
  const selectedProducts = getRandomElements(await productsPage.getProducts(), 2);
  for( const product of selectedProducts ) {
    await productsPage.addProductToCart(product);
  }

  const cartContents = await productsPage.getCartContents()
  expect(cartContents.size).toBe(2);
  expect([...selectedProducts.map(product => product.name)].every(productName => cartContents.has(productName))).toBeTruthy();

  for( const product of selectedProducts ) {
    await productsPage.removeFromCart(product);
  }
  expect(await productsPage.isCartEmpty()).toBeTruthy();
});



/*
## HL007	Adding item review:
Preconditions:
1. Open https://magento.softwaretestingboard.com/gear/fitness-equipment.html

Steps:
1. Select random item, and go to its details page
   Result: Details page of selected item should load, with item details (title, price) matching selected item 
2. Click on the reviews tab
   Result: Reviews tab should open with number of reviews, and its average matching product card
3. Fill in review form with valid data and click submit
   Result: Information should appear that review was successfully submitted to moderation

 */
test('adding review', async({page}) => {
  const productsPage = new ProductsPage(page);
  await productsPage.goto();
  const selectedProduct = getRandomElement(await productsPage.getProducts());
  const productDetailsPage = await productsPage.gotoProductDetails(selectedProduct.name);
  await expect(page).toHaveTitle(selectedProduct.name);
  const productOfDetailsPage = await productDetailsPage.getProductData();

  expect(selectedProduct).toEqual(productOfDetailsPage);
  
  const review = Review.builder()
    .nickname("user")
    .summary("shoort")
    .content('full review')
    .rating(Review.Rating.FOUR_STARS)
    .build();

  // TODO: validate review count!!

  await productDetailsPage.addReview(review);
  expect(await productDetailsPage.reviewAddedSuccesfully()).toBeTruthy();
});