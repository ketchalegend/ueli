export class StringHelpers {
    public static removeWhiteSpace(value: string): string {
        return value.replace(/\s/g, "");
    }

    public static splitIntoWords(value: string): string[] {
        return value.split(/\s/g);
    }

    public static stringIsWhiteSpace(value: string): boolean {
        if (value === undefined || value === null) {
            return true;
        }

        return StringHelpers.removeWhiteSpace(value).length === 0;
    }

    public static trimAndReplaceMultipleWhiteSpacesWithOne(value: string): string {
        return value.replace(/\s\s+/g, " ").trim();
    }

    public static stringToWords(value: string): string[] {
        const words = value.split(/\s/g);
        return words.filter((w): boolean => {
            return !StringHelpers.stringIsWhiteSpace(w);
        });
    }

    public static isValidEmailAddress(emailAddress: string) {
        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regex.test(emailAddress);
    }

    public static isValidUrl(url: string): boolean {
        const http = "http://";
        const https = "https://";
        const fullUrlRegex = new RegExp(/^((https?:)?[/]{2})?([a-z0-9]+[.])+[a-z]{2,}.*$/i, "gi");
        const stringStartsWithHttpOrHttps = (url.startsWith(http) && url.length > http.length) || (url.startsWith(https) && url.length > https.length);
        return (fullUrlRegex.test(url) || stringStartsWithHttpOrHttps) && !this.isValidEmailAddress(url);
    }
}
