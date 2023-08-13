import { expect, test } from '@playwright/test';

test.skip('product page add item to basket', async ({ page }) => {
  await page.goto("/");
  // await page.pause();

  const addToBasketButton = page.locator('[data-qa="product-button"]').first();
  await addToBasketButton.waitFor();

  await expect(addToBasketButton).toHaveText("Add to Basket");

  await addToBasketButton.click();

  const numberOfProductsInTheBasket = page.locator('[data-qa="header-basket-count"]');

  await expect(numberOfProductsInTheBasket).toHaveText("1");

  await expect(addToBasketButton).toHaveText("Remove from Basket");

  await addToBasketButton.click();

  await expect(numberOfProductsInTheBasket).toHaveText("0");


  await page.pause();

  const checkoutLink = page.getByRole('link', { name: 'Checkout' });
  await checkoutLink.waitFor();


  await checkoutLink.click();

  await expect(page).toHaveURL("/basket");
});

// productPage.visit();
// productPage.sortProductsByCheapest();
// productPage.addItemToBasket(1);
// navigation.moveToCheckout();
// basket.removeCheapestItem();