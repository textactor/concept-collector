
import { KnownNameService } from './knownNameService';
import test from 'ava';

const knownName = new KnownNameService();

test('ro_md (Moldova)', t => {
    t.is(knownName.getKnownName('Moldova', 'ro', 'md'), 'Republica Moldova');
    t.is(knownName.getKnownName('Moldovei', 'ro', 'md'), 'Republica Moldova');
});

test('ro (Moscovei)', t => {
    t.is(knownName.getKnownName('Moscovei', 'ro', 'md'), 'Moscova');
});

// test('ro_ro ... din Capitala', t => {
//     t.is(knownName.getKnownName('Catedrala din Capitala', 'ro', 'ro'), 'Catedrala din București');
// });

// {
//     "search": [
//       "(.+) din Capital[ăa]"
//     ],
//     "replace": "$2 din București"
//   },