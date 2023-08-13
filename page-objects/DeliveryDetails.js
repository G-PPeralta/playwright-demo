import { expect } from "@playwright/test";

export class DeliveryDetails {
  constructor(page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-qa="delivery-first-name"]');
    this.lastNameInput = page.locator('[data-qa="delivery-last-name"]');
    this.streetInput = page.locator('[data-qa="delivery-address-street"]');
    this.postCodeInput = page.locator('[data-qa="delivery-postcode"]');
    this.cityInput = page.locator('[data-qa="delivery-city"]');
    this.countryDropdown = page.locator('[data-qa="country-dropdown"]');

    this.saveAddressButton = page.locator('[data-qa="save-address-button"]');
    this.continueToPaymentButton = page.locator('[data-qa="continue-to-payment-button"]');

    this.savedAddressContainer = page.locator('[data-qa="saved-address-container"]');
    this.savedAddressFirstName = page.locator('[data-qa="saved-address-firstName"]');
    this.savedAddressLastName = page.locator('[data-qa="saved-address-lastName"]');
    this.savedAddressStreet = page.locator('[data-qa="saved-address-street"]');
    this.savedAddressPostCode = page.locator('[data-qa="saved-address-postcode"]');
    this.savedAddressCity = page.locator('[data-qa="saved-address-city"]');
    this.savedAddressCountry = page.locator('[data-qa="saved-address-country"]');
    this.continueToPaymentButton = page.getByRole('button', { name: 'Continue to payment' });
  }


  fillForm = async (deliveryDetails) => {
    this.firstNameInput.waitFor();
    await this.firstNameInput.fill(deliveryDetails.firstName);

    this.lastNameInput.waitFor();
    await this.lastNameInput.fill(deliveryDetails.lastName);

    this.streetInput.waitFor();
    await this.streetInput.fill(deliveryDetails.street);

    this.postCodeInput.waitFor();
    await this.postCodeInput.fill(deliveryDetails.postCode);

    this.cityInput.waitFor();
    await this.cityInput.fill(deliveryDetails.city);

    this.countryDropdown.waitFor();
    await this.countryDropdown.selectOption({ label: deliveryDetails.country });
  };

  saveDetails = async () => {
    const addressCountBeforeSaving = await this.savedAddressContainer.count();
    await this.saveAddressButton.waitFor();
    await this.saveAddressButton.click();
    await this.savedAddressContainer.waitFor();

    expect(this.savedAddressContainer).toHaveCount(addressCountBeforeSaving + 1);

    await this.savedAddressFirstName.waitFor();
    expect(await this.savedAddressFirstName.first().innerText()).toBe(await this.firstNameInput.inputValue());

    await this.savedAddressLastName.waitFor();
    expect(await this.savedAddressLastName.first().innerText()).toBe(await this.lastNameInput.inputValue());

    await this.savedAddressStreet.waitFor();
    expect(await this.savedAddressStreet.first().innerText()).toBe(await this.streetInput.inputValue());

    await this.savedAddressPostCode.waitFor();
    expect(await this.savedAddressPostCode.first().innerText()).toBe(await this.postCodeInput.inputValue());

    await this.savedAddressCity.waitFor();
    expect(await this.savedAddressCity.first().innerText()).toBe(await this.cityInput.inputValue());

    await this.savedAddressCountry.waitFor();
    expect(await this.savedAddressCountry.first().innerText()).toBe(await this.countryDropdown.inputValue());
  };

  continueToPayment = async () => {
    await this.continueToPaymentButton.waitFor();
    await this.continueToPaymentButton.click();
    await this.page.waitForURL(/\/payment/, { timeout: 3000 });
  };
}