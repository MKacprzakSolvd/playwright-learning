import { Page } from '@playwright/test';
import {boxedStep} from '../util/boxed-step';

export class HomePage {
    constructor(private readonly page: Page) {}

    async goto() {
        await this.page.goto('https://magento.softwaretestingboard.com/');
    }

    @boxedStep
    async searchProduct( productName : string) {
        await this.page.getByRole('combobox', {'name': 'Search'}).fill(productName);
        await this.page.getByRole('button', {'name': 'Search'}).click();
    }
}