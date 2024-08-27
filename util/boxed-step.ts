// From 'github/playwright-examples'
import { test } from '@playwright/test';


// Leveraging TypeScript decorators to wrap functions
// https://www.typescriptlang.org/docs/handbook/decorators.html
// A boxed test.step() gets defined with the name of the method
export function boxedStep(target: Function, context: ClassMethodDecoratorContext) {
    return function replacementMethod(...args: any) {
      const name = this.constructor.name + '.' + (context.name as string);
      return test.step(name, async () => {
        return await target.call(this, ...args);
      }, { box: true });  // Note the "box" option here.
    };
}
  