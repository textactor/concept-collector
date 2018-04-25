
import { KNOWN_NAMES, KnownNamesType } from './knownNames';

export interface IKnownNameService {
    getKnownName(name: string, lang: string, country: string): string
}

export class KnownNameService implements IKnownNameService {
    private data: KnownNamesType

    constructor(data?: KnownNamesType) {
        this.data = data || KNOWN_NAMES;
    }

    getKnownName(name: string, lang: string, country: string): string {
        if (this.data[lang]) {
            let items = this.data[lang].items;
            if (items) {
                for (let item of items) {
                    if (item.search.test(name)) {
                        return item.name;
                    }
                }
            }
            if (this.data[lang].countries) {
                items = this.data[lang].countries[country];
                if (items) {
                    for (let item of items) {
                        if (item.search.test(name)) {
                            return item.name;
                        }
                    }
                }
            }
        }
    }
}
