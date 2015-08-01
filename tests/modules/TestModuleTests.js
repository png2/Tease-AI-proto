import '../auto_mock_off';

var methodsToTest = require('../..//modules/Test.js');

var ui = {
    debug(text) {
    }
}

describe('Test the test module', () => {
    it('The @testCommand without params should call ui.debug', () => {
        methodsToTest.testCommand(null,ui,null,null,[]);
        expect(ui.debug).toBeCalled();
    });
});