import GeneralHelper from "../../../helpers/generalhelper";
type userTestData = {
    userName: string,
    password: string
}
class UsersDataProvider {

    userTestData: userTestData[] = [];

    constructor() {
        this.populateGenericUserCredentials(6);
    }

    public async populateGenericUserCredentials(numberOfEntriesToGenerate: number) {
        for (var i = 0; i < numberOfEntriesToGenerate; i++) {
            this.userTestData.push(await this.getGenericUserCredentials());
        }
    }

    public async getGenericUserCredentials() {
        const genericCredentials: any = {
            userName: GeneralHelper.generateRandomString(8),
            password: GeneralHelper.generateRandomString(8)
        }
        return genericCredentials;
    }

}

export default new UsersDataProvider();

