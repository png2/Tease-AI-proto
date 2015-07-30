import './auto_mock_off';

import {ScriptParser} from '../core/parsers/ScriptParser.js';

var parser = new ScriptParser();

describe('Test conf', () => {
    it('should display something', () => {
        var result = parser._parseLine('toto');
        expect(result).toBe('toto');
    });
});