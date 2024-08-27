# Test cases
Website: https://magento.softwaretestingboard.com			
## HL001	Product Search
1. Open https://magento.softwaretestingboard.com website
   Result: Home page sould load
2. Insert "bag" into search field and click search
   Result: Search page should open, containing non-empty list of items

## HL002	Filtering by size and color:
Preconditions:
1. Open https://magento.softwaretestingboard.com/women/tops-women.html

Steps:
1. Filter products by random size
   Result: All showed products should be available in the selected size.
2. Filter products by random color
   Result: All showed products should be available in the selected color and size. 

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

## HL004	Checkout process from products page:
Preconditions:
1. Open https://magento.softwaretestingboard.com/gear/bags.html

Steps:
1. Add random product to card
   Result: There should appear information that the product was added to the shopping card
2. Open shopping cart popup
   Result: Shopping cart popup should show, containing one selected item
3. Click proceed to checkout
   Result: Checkout page should load
4. Expand Order Summary
   Result: Order summary should contain one selected item
5. Fill in valid Shipping data , select Fixed shipping method and click Next
   Result: Order Review page should load, containing inserted data and ordered product, with correctly calculated order price
6. Click place order
   Result: Order Success page should load
7. Click continue shopping
   Result: Home page should load

## HL005	Item sorting:
Preconditions:
1. Open https://magento.softwaretestingboard.com/women/bottoms-women.html

Steps:
1. Sort items by product name in ascending order
   Result: Items should by sorted by product name in ascending order
2. Sort items by product name in descending order
   Result: Items should be sorted by product name in descending order
3. Sort items by price in ascending order
   Result: Items should be sorted by price in ascending order
4. Sort items by price in descending order
   Result: Items should be sorted by price in descending order
5. Go to next page
   Result: item's prices should continue to descend

## HL006	Checkout process from item's details page:
Preconditions:
1. Open https://magento.softwaretestingboard.com/men/bottoms-men.html

Steps:
1. Select random item, and go to its details page
   Result: Details page of selected item should load, with item details (title, price) matching selected item 
2. Select random size, color and quantity (between 1 and 100) and add item to cart
   Result: There should appear information that the product was added to the shopping card
3. Click on the shopping cart
   Result: Shopping cart popup should appear, containing one selected item in the chosen color, size and quantity
4. Click proceed to checkout
   Result: Checkout page should load
5. Expand Order Summary
   Result: Order summary should contain one selected item in the chosen color, size and quantity
6. Fill in valid Shipping data , select Fixed shipping method and click Next
   Result: Order Review page should load, containing inserted data and ordered product, with correctly calculated order price
7. Click place order
   Result: Order Success page should load
8. Click continue shopping
   Result: Home page should load

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
