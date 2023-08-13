import { expect } from "@playwright/test";

export class RegisterPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByPlaceholder('E-Mail');
    this.passwordInput = page.getByPlaceholder('Password')
    this.signupButton = page.getByRole('button', { name: 'Register' })
  }

  signup = async (email, password) => {
    // Wait for elements

    await this.emailInput.waitFor();
    await this.passwordInput.waitFor();
    await this.signupButton.waitFor();

    // Check if they are visible

    expect(await this.emailInput.isVisible()).toBeTruthy();
    expect(await this.passwordInput.isVisible()).toBeTruthy();
    expect(await this.signupButton.isVisible()).toBeTruthy();

    // type into email input and verify the value

    await this.emailInput.fill(email);
    expect(await this.emailInput.inputValue()).toBe(email);


    // type into password input

    await this.passwordInput.fill(password);
    expect(await this.passwordInput.inputValue()).toBe(password);

    // click on signup button

    await this.signupButton.click();
  };
}