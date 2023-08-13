import { expect } from "@playwright/test";
import { Navigation } from "./Navigation";

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.addButtons = page.locator('[data-qa="product-button"]');
    this.basketCounter = page.locator('[data-qa="header-basket-count"]');
    this.navigation = new Navigation(page);
    this.sortDropdown = page.locator('[data-qa="sort-dropdown"]');
    this.productTitles = page.locator('[data-qa="product-title"]');
  }

  visit = async () => {
    await this.page.goto("/");
  }


  addProductToBasket = async (index) => {
    const specificAddButton = this.addButtons.nth(index);

    await specificAddButton.waitFor();
    await expect(specificAddButton).toHaveText("Add to Basket");
    const basketCountBeforeAdding = await this.navigation.getBasketCount()
    expect(basketCountBeforeAdding).toBe(index);
    await specificAddButton.click();
    const basketCountAfterAdding = await this.navigation.getBasketCount();
    expect(basketCountAfterAdding).toBe(index + 1);
    expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding);
    await expect(this.addButtons.nth(index)).toHaveText("Remove from Basket");
  };

  sortByCheapest = async () => {
    await this.sortDropdown.waitFor();
    await this.productTitles.first().waitFor();

    //Get order of products before sorting
    const productsTitlesBeforeSorting = await this.productTitles.allInnerTexts();

    // ACTIONS
    await this.sortDropdown.selectOption({ label: "Price ascending" });

    //Get order of products after sorting
    const productsTitlesAfterSorting = await this.productTitles.allInnerTexts();

    expect(productsTitlesBeforeSorting).not.toEqual(productsTitlesAfterSorting);
  };
}