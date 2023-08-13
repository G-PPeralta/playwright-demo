import { test } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { deliveryDetails } from '../data/deliveryDetails';
import { paymentDetails } from '../data/paymentDetails';
import { Checkout } from '../page-objects/Checkout';
import { DeliveryDetails } from '../page-objects/DeliveryDetails';
import { Login } from '../page-objects/Login';
import { ProductsPage } from '../page-objects/ProductsPage';
import { RegisterPage } from '../page-objects/RegisterPage';
import { PaymentPage } from '../page-objects/PaymentPage';


test.only("new user full journey", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const checkout = new Checkout(page);
  const login = new Login(page);
  const registerPage = new RegisterPage(page);
  const deliveryDetailsPage = new DeliveryDetails(page);
  const paymentPage = new PaymentPage(page);

  await productsPage.visit();
  await productsPage.sortByCheapest();
  await productsPage.addProductToBasket(0);
  await productsPage.addProductToBasket(1);
  await productsPage.addProductToBasket(2);
  await productsPage.navigation.getBasketCount();
  await productsPage.navigation.goToCheckout();
  await checkout.removeCheapestProduct();
  await checkout.continueToCheckout();
  await login.moveToSignup();

  const uniqueId = uuidv4();

  const email = `${uniqueId}@gmail.com`
  const password = `${uniqueId}123`

  await registerPage.signup(email, password);
  await deliveryDetailsPage.fillForm(deliveryDetails);
  await deliveryDetailsPage.saveDetails();
  await deliveryDetailsPage.continueToPayment();
  await paymentPage.activateDiscount();
  await paymentPage.fillPaymentDetails(paymentDetails);
  await paymentPage.completePayment();
});
