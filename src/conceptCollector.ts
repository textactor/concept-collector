
import { UseCase, IUseCase } from '@textactor/domain';
import { Concept, ConceptHelper } from '@textactor/concept-domain';
import { parse } from 'concepts-parser';

export type Context = {
    text: string
    lang: string
    country: string
}

export class ConceptCollector extends UseCase<Context, Concept[], void> {

    constructor(private pushConcepts: IUseCase<Concept[], Concept[], void>) {
        super();
    }

    protected innerExecute(context: Context): Promise<Concept[]> {
        const items = parse(context, { mode: 'collect' });
        if (!items || !items.length) {
            return Promise.resolve([]);
        }

        const concepts = items.map(item => {
            const conceptContext = getContextFromText(context.text, item.index, item.value.length);

            return ConceptHelper.create({
                name: item.value, abbr: item.abbr, context: conceptContext, lang: context.lang,
                country: context.country
            });
        });

        return this.pushConcepts.execute(concepts);
    }
}


function getContextFromText(text: string, index: number, length: number): string {
    const start = index < 50 ? 0 : index - 50;
    return text.substring(start, index + length + 50);
}
