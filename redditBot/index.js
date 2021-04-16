'use strict';

const reddit = require('./reddit');


(async () => {

    await reddit.initialize();

    await reddit.login('', ''); //username passwordd
    //await reddit.login('ertds', '1sdgsd@!'); //wrong user name and password test

    //await reddit.subreddit('BotsPlayHere')

    await reddit.post('BotsPlayHere', {
        type: 'text',
        title: 'I admire you',
        text: 'I admire you cristian and anna'
    });

    debugger;
    
})();