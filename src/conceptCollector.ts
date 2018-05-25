
const debug = require('debug')('textactor:concept-collector');

import { UseCase, IUseCase } from '@textactor/domain';
import { Concept, ConceptHelper, KnownConceptData, IKnownNameService } from '@textactor/concept-domain';
import { parse } from 'concepts-parser';
import { getContextFromText } from './helpers';

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
                debug(`set concept known name: ${conceptData.name}=>${conceptData.knownName}`);
            }

            return ConceptHelper.build(conceptData);
        });

        return this.pushConcepts.execute(concepts);
    }
}
