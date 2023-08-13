import { expect } from "@playwright/test";

export class Checkout {
  constructor(page) {
    this.page = page;

    this.basketCards = page.locator('[data-qa="basket-card"]');
    this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
    this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]');
    this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]');
  }

  removeCheapestProduct = async () => {
    await this.basketCards.first().waitFor();
    await this.basketItemPrice.first().waitFor();

    const numberOfItemsInBasketBeforeRemoval = await this.basketCards.count();

    const allPriceTexts = await this.basketItemPrice.allInnerTexts();
    const convertedPricesToNumbers = allPriceTexts.map((price) => parseInt(price.replace("$", "")));
    const lowestPrice = Math.min(...convertedPricesToNumbers);
    const lowestPriceIndex = convertedPricesToNumbers.findIndex((price) => price === lowestPrice);
    // const lowestPriceCard = await this.basketCards.nth(lowestPriceIndex);



    // ACTIONS
    const removeLowestPriceButton = await this.basketItemRemoveButton.nth(lowestPriceIndex);
    await removeLowestPriceButton.waitFor();
    await removeLowestPriceButton.click();

    // ASSERTIONS
    // await expect(lowestPriceCard).not.toBeVisible();
    await expect(this.basketCards).toHaveCount(numberOfItemsInBasketBeforeRemoval - 1);
  };

  continueToCheckout = async () => {
    await this.continueToCheckoutButton.waitFor();
    await this.continueToCheckoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 3000 });

    expect(this.page.url()).toContain("/login");
  };
}