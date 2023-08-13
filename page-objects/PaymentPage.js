import { expect } from "@playwright/test";

export class PaymentPage {
  constructor(page) {
    this.page = page;

    this.discountCode = page.frameLocator('[data-qa="active-discount-container"]').locator('[data-qa="discount-code"]');
    this.discountCodeInput = page.locator('[data-qa="discount-code-input"]');

    this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]');
    this.discountCodeActivatedMessage = page.locator('[data-qa="discount-active-message"]');
    this.totalWithoutDiscount = page.getByText('Total:');

    this.totalIncludingDiscount = page.getByText('Total including discount:');

    this.cardOwnerInput = page.locator('[data-qa="credit-card-owner"]');
    this.cardNumberInput = page.locator('[data-qa="credit-card-number"]');
    this.validUntilInput = page.locator('[data-qa="valid-until"]');
    this.cardCvvInput = page.locator('[data-qa="credit-card-cvc"]');

    this.payButton = page.getByRole('button', { name: 'Pay' });
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor();
    const discountCode = await this.discountCode.innerText();

    await this.discountCodeInput.waitFor();

    //Option 1
    await this.discountCodeInput.fill(discountCode);
    await expect(this.discountCodeInput).toHaveValue(discountCode);

    //Option 2
    // await this.discountCodeInput.focus();
    // await this.page.keyboard.type(discountCode, { delay: 1000 });

    // await expect(this.discountCodeInput).toHaveValue(discountCode);

    await this.activateDiscountButton.waitFor();
    expect(this.discountCodeActivatedMessage).not.toBeVisible();
    await this.activateDiscountButton.click();

    await this.discountCodeActivatedMessage.waitFor();
    await expect(this.discountCodeActivatedMessage).toHaveText('Discount activated!');

    await this.totalWithoutDiscount.waitFor();
    const totalWithoutDiscountValue = await this.totalWithoutDiscount.innerText();
    const totalWithoutDiscountValueNumber = +totalWithoutDiscountValue.split(':')[1].replace('$', '');

    await this.totalIncludingDiscount.waitFor();
    const totalIncludingDiscountValue = await this.totalIncludingDiscount.innerText();
    const totalIncludingDiscountValueNumber = +totalIncludingDiscountValue.split(':')[1].replace('$', '');

    expect(totalIncludingDiscountValueNumber).toBeLessThan(totalWithoutDiscountValueNumber);
  };

  fillPaymentDetails = async (paymentDetails) => {
    await this.cardOwnerInput.waitFor();
    await this.cardOwnerInput.fill(paymentDetails.cardOwner);

    await this.cardNumberInput.waitFor();
    await this.cardNumberInput.fill(paymentDetails.cardNumber);

    await this.validUntilInput.waitFor();
    await this.validUntilInput.fill(paymentDetails.validUntil);

    await this.cardCvvInput.waitFor();
    await this.cardCvvInput.fill(paymentDetails.cardCvv);
  };

  completePayment = async () => {
    await this.payButton.waitFor();
    await this.payButton.click();

    await this.page.waitForURL(/\/thank-you/);
  }
}