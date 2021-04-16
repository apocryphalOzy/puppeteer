'use strict';

const puppeteer = require('puppeteer');

const REDDIT_URL = `https://old.reddit.com`;
const SUBREDDIT_URL = (reddit) => `https://old.reddit.com/r/${reddit}/`;
const SUBREDDIT_SUBMIT_TEXT_URL = (reddit) => `https://old.reddit.com/r/${reddit}/submit?selftext=true`;
const SUBREDDIT_SUBMIT_LINK_URL = (reddit) => `https://old.reddit.com/r/${reddit}/submit`;

//object to store all of our functions and call to it in the index.js file
const self = {
    //puppeteer related variables
    //variable that holds the browser
    browser: null,
    //variable that holds the page
    page: null,

    
    initialize: async () => {
        //initialize the browser
        self.browser = await puppeteer.launch({
            headless: false
        });
        //make a new page in the browser
        self.page = await self.browser.newPage(); //this will give a new blank page


    },

    login: async (username, password) => {
        await self.page.goto(REDDIT_URL, { waitUntil: 'networkidle0' });
        
        /* write in username and password */
        await self.page.type('input[name="user"]', username, { delay: 100 });
        await self.page.type('input[name="passwd"]', password, { delay: 100 });
        
        /*Click login button*/
        await self.page.click(`#login_login-main > div.submit > button`);

        /*Check if any error has happened*/
        //wait for a form that has logout action or an error
        await self.page.waitForSelector('form[action="https://old.reddit.com/logout"],div[class="status error"]'); 
        //check if error is found
        let error = await self.page.$('div[class="status error"]');

        //if error is present and not null
        if (error) {
            let errorMessage = await (await error.getProperty('innerText')).jsonValue();

            console.log(`${username} has failed to log in`);
            console.log(`Error from website: ${errorMessage}`);
            //stop execution of rest of code
            process.exit(1);
        } else {
            console.log(`${username} is now logged in`)
        }

    },

    subreddit: async (reddit) => {
        /* Go to subreddit */
        await self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0' });//waits 500ms for page to load and for no more requests
        
    },

    post: async (reddit, data = {}) => {
        
        switch (data.type) {
            case 'text':
                /* Go to subreddit */
                await self.page.goto(SUBREDDIT_SUBMIT_TEXT_URL(reddit), { waitUntil: 'networkidle0' });

                /*make sure the page is loaded*/
                await self.page.waitFor(2500);

                /*Write data in the inputs */
                await self.page.type('textarea[name="title"]', data.title);
                await self.page.type('textarea[name="text"]', data.text);
            
            break;
            
            case 'link':
                /* Go to subreddit */
                await self.page.goto(SUBREDDIT_SUBMIT_LINK_URL(reddit), { waitUntil: 'networkidle0' });
                
                /*make sure the page is loaded*/
                await self.page.waitFor(2500);

                /*Write data in the inputs */
                await self.page.type('#url', data.url);
                await self.page.type('textarea[name="title"]', data.title);
            break;
        }
                    
        /*Submit the post*/
         await self.page.click('#newlink > div.spacer > button')
        
    }


}

module.exports = self;