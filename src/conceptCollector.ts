
import { UseCase, IUseCase } from '@textactor/domain';
import { Concept, ConceptHelper, KnownConceptData, IKnownNameService } from '@textactor/concept-domain';
import { parse } from 'concepts-parser';

export type Context = {
    text: string
    lang: string
    country: string
    containerId: string
}

export class ConceptCollector extends UseCase<Context, Concept[], void> {
    constructor(private pushConcepts: IUseCase<Concept[], Concept[], void>, private knownNames: IKnownNameService) {
        super();
    }

    protected innerExecute(context: Context): Promise<Concept[]> {
        const items = parse(context, { mode: 'collect' });
        if (!items || !items.length) {
            return Promise.resolve([]);
        }

        const concepts = items.map(item => {
            const conceptContext = getContextFromText(context.text, item.index, item.value.length);

            const conceptData: KnownConceptData = {
                name: item.value, abbr: item.abbr, context: conceptContext, lang: context.lang,
                country: context.country,
                containerId: context.containerId,
            };
            const knownName = this.knownNames.getKnownName(conceptData.name, conceptData.lang, conceptData.country);
            if (knownName && knownName.name) {
                conceptData.knownName = knownName.name;
            }

            return ConceptHelper.build(conceptData);
        });

        return this.pushConcepts.execute(concepts);
    }
}


function getContextFromText(text: string, index: number, length: number): string {
    const start = index < 50 ? 0 : index - 50;
    return text.substring(start, index + length + 50);
}
