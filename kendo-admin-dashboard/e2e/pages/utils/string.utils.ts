export class StringUtils {

   /**
    * Check whether array of strings @array appears in the string @wholeString.
    * @param {string} wholeString
    * @param {Array<string>} array
    * @return {boolean} If any of the strings in @array doesn't appear, then we return false, otherwise return true.
    */
    static containStrings(wholeString: string, array: Array<string>) {
        if (wholeString !== undefined) {
            return !array.some(item => !wholeString.includes(item));
        } else {
            return false;
        }
    }

   /**
    * Check whether array of strings @expectedArray appears in the @actualArray.
    * @param {Array<string>} actualArray
    * @param {Array<string>} expectedArray
    * @return {boolean} If any of the strings in @expectedArray don't match any in the @actualArray, then we return false, otherwise return true.
    */
    static exactMatchStringsInArrays(actualArray: Array<string>, expectedArray: Array<string>) {
        if (actualArray && (actualArray.length >= expectedArray.length)) {
            return expectedArray.every(element => {
                return actualArray.indexOf(element) !== -1;
            });
        } else {
            return false;
        }
    }

   /**
    * Finds each empty space(s) sequence inside @originalString and replaces it with the given @replacingSymbol
    * @param {string} originalString
    * @param {string} replacingSymbol
    * @returns {string} The modified string.
    */
    static replaceSpacesWith(originalString: string, replacingSymbol: string) {
        return originalString.replace(/\s/g, replacingSymbol); // replace all empty spaces
    }

   /**
    * Generate random number between two numbers
    * @param {number} min
    * @param {number} max
    * @returns {number}
    */
    static generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
    * Method to generate random sequence of letters [a-zA-z] with the given length
    * @param {number} length the desired length of the string
    * @returns {string} the generated string
    */
    static getRandomAlpha(length: number = 6): string {
        const numbersList: Array<number> = [];
        for (let i = 0; i < length; i++) {
        let randAsciiCodeOfLetter: number;
        const numZeroOne = Math.round(Math.random());
        if (numZeroOne === 0) {
            // capital letter
            // generates a random number between 65 (inclusive) and 91 (exclusive), ascii codes of capital letters
            randAsciiCodeOfLetter = this.generateRandomNumber(65, 90);
        } else {
            // small letter
            // generates a random number between 97 (inclusive) and 123 (exclusive), ascii codes of small letters
            randAsciiCodeOfLetter = this.generateRandomNumber(97, 122);
        }
        numbersList.push(Math.trunc(randAsciiCodeOfLetter));
        }
        return String.fromCharCode(...numbersList);
    }
}

export const globalRandomString = StringUtils.getRandomAlpha(9);
