import Page from "../pageobjects/Page";
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// project root path in the file system
const projectRoot = process.cwd();

export class GeneralHelper extends Page {
    returnOnlyNumbersFromString(str) {
        str = str.replace(/^\D+/g, '');
        if (str.length === 0) {
            throw new Error('returnOnlyNumbersFromString string length is 0.')
        }
        return str;
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    extractUrlFromString(str) {
        const urlExtractingRegex = new RegExp(/(https?:\/\/[^\s]+)/g);
        const result = str.match(urlExtractingRegex)![0];
        if (result !== null) {
            return result;
        }
        throw new Error(`Failed to extract url from string: ${str}`);
    }

    returnResolvedTestFilePath(fileName: string) {
        if (projectRoot === undefined) {
            throw new Error('failed to parse project root path');
        }
        return path.join(projectRoot, '/test-files/', fileName)
    }
    /**
    * Returns a random string
    * @param {length} length of string.
    **/
    generateRandomString(length: number): string {
        return uuidv4().substring(1, length);
    }

    generateRandomEmail(length: number): string {
        return `${uuidv4().substring(1, length)}@test.bg`;
    }

    generateRandomAddress(addressNameLength: number): string {
        return `${this.randomFixedInteger(3)} ${uuidv4().substring(1, addressNameLength)} Street`;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
    * Returns a random integer
    * @param {length} length of integer.
    **/
    randomFixedInteger(length: number) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    }

    stripWhiteSpace(str) {
        if (!!!str) return ""
        return str.replace(/\s/g, "");
    }

    returnRandomImageUrl() {
        const randomImages = [
            'https://i.imgur.com/BMSSPFJ.jpeg',
            'https://i.imgur.com/s43692u.jpeg',
            'https://i.imgur.com/2bvab7y.jpeg',
            'https://i.imgur.com/zt7smR4.jpeg',
            'https://i.imgur.com/ZmcYXQK.jpeg',
            'https://i.imgur.com/YP7oS9H.jpeg',
            'https://i.imgur.com/uvFEcJN.jpeg',
            'https://i.imgur.com/zYHcHDN.jpeg',
            'https://i.imgur.com/qPkJUau.png',
            'https://i.imgur.com/nScazCd.jpeg'

        ]
        return randomImages[Math.floor(Math.random() * randomImages.length)]
    }

}
export default new GeneralHelper();