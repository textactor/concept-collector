
import test from 'ava';
import { getContextFromText } from './helpers';

test('getContextFromText', t => {
    t.true(getContextFromText('some long Text', 10, 4).includes('Text'));
})
