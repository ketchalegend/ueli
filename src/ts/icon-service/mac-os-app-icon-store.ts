import { ApplicationIcon } from "./application-icon";
import { SearchResultItem } from "../search-result-item";
import { normalize, join } from "path";
import { convert } from "app2png";
import { existsSync, mkdirSync } from "fs";
import { AppIconStore } from "./app-icon-store";
import { IconSet } from "../icon-sets/icon-set";
import { AppIconStoreHelpers } from "../helpers/app-icon-store-helpers";

export class MacOsAppIconStore implements AppIconStore {
    private readonly storePath: string;
    private icons: ApplicationIcon[] = [];
    private readonly iconSet: IconSet;

    constructor(storePath: string, iconSet: IconSet) {
        this.storePath = storePath;
        this.iconSet = iconSet;
    }

    public addIcon(icon: ApplicationIcon): void {
        this.icons.push(icon);
    }

    public getIcon(iconName: string): ApplicationIcon | undefined {
        return this.icons.find((icon: ApplicationIcon) => icon.name === iconName);
    }

    public init(searchResultItems: SearchResultItem[]): void {
        this.icons = [];

        if (!existsSync(this.storePath)) {
            mkdirSync(this.storePath);
        }

        searchResultItems
            .filter((searchResultItem: SearchResultItem) => {
                return searchResultItem.icon === this.iconSet.appIcon;
            }).forEach((searchResultItem: SearchResultItem) => {
                const appFilePath = normalize(searchResultItem.executionArgument);
                const appName = searchResultItem.name;
                const outFilePath = join(this.storePath, `${AppIconStoreHelpers.buildIconFileName(appName)}.png`);

                convert(appFilePath, outFilePath).then(() => {
                    this.addIcon({ name: appName, PNGFilePath: outFilePath });
                }).catch((err) => {
                    // tslint:disable-next-line:no-console
                    console.log(`Error while generating app icon: ${err}`);
                });
            });

        this.removeNonExistentIcons();
    }

    private removeNonExistentIcons(): void {
        const indexesToDelete = [];

        for (let i = 0; i < this.icons.length; i++) {
            if (!existsSync(this.icons[i].PNGFilePath)) {
                indexesToDelete.push(i);
            }
        }

        indexesToDelete.forEach((i) => this.icons.splice(i, 1));
    }
}
