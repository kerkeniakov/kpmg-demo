
import { TESTS_TIMEOUT_MAX } from '../constants/testconstants';
import Page from './Page';

/**
 * sub page containing specific selectors and methods for a specific page
 */

// should probably move the types but since this is a demo I'm leaving it here
type postData = {
    name: string,
    imageUrl: string,
    description: string
}

class DemoPage extends Page {
    // Todo: add specific page methods here

    public async registerNewAccount(username, password) {
        (await $('//a[contains(text(),"Sign Up")]')).click();
        await $('[name="username"]').waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });

        await $('[name="username"]').setValue(username);
        await $('[name="password"]').setValue(password);

        await $('[type="submit"]').click();
    }

    public async login(username, password) {
        (await $('//a[contains(text(),"Login")]')).click();
        await $('[name="username"]').waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });

        await $('[name="username"]').setValue(username);
        await $('[name="password"]').setValue(password);

        await $('[type="submit"]').click();
    }

    public async populateNewPost(postData: postData) {
        await $('[name="name"]').waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });

        await $('[name="name"]').setValue(postData.name);
        await $('[name="image"]').setValue(postData.imageUrl);
        await $('[name="description"]').setValue(postData.description);
    }
}

export default new DemoPage();
