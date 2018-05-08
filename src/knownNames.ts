
export const KNOWN_NAMES: KnownNamesType = require('../known-names.json');
initKnownNames();

function initKnownNames() {
    let list: KnownNameItem[] = []
    for (let lang of Object.keys(KNOWN_NAMES)) {
        list = list.concat(KNOWN_NAMES[lang].items || []);
        if (KNOWN_NAMES[lang].countries) {
            for (let country of Object.keys(KNOWN_NAMES[lang].countries)) {
                list = list.concat(KNOWN_NAMES[lang].countries[country] || []);
            }
        }
    }
    for (let item of list) {
        if (!item.name && !item.replace) {
            throw new Error(`'name' or 'replace' are required`);
        }
        const items = <string[]><any>item.search;
        if (!items.length) {
            throw new Error(`Invalid item: ${JSON.stringify(item)}`);
        }
        item.search = new RegExp(`^(${items.join('|')})$`);
    }
}

export type KnownNamesType = {
    [lang: string]: LanguageKnownNames
}

export type LanguageKnownNames = {
    items?: KnownNameItem[]
    countries?: {
        [country: string]: KnownNameItem[]
    }
}

export type KnownNameItem = {
    search: RegExp
    name?: string
    replace?: string
}
