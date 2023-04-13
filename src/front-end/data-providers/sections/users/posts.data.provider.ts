import GeneralHelper from "../../../helpers/generalhelper";
type postData = {
    name: string,
    imageUrl: string,
    description: string
}
class PostsDataProvider {

    postsTestData: postData[] = [];

    constructor() {
        this.populateGenericPostData(6);
    }

    public async populateGenericPostData(numberOfEntriesToGenerate: number) {
        for (var i = 0; i < numberOfEntriesToGenerate; i++) {
            this.postsTestData.push(await this.getGenericPostData());
        }
    }

    public async getGenericPostData() {
        const genericCredentials: postData = {
            name: GeneralHelper.generateRandomString(8),
            imageUrl: GeneralHelper.returnRandomImageUrl(),
            description: GeneralHelper.generateRandomString(6)
        }
        return genericCredentials;
    }

}

export default new PostsDataProvider();

