<!-- ABOUT THE PROJECT -->
## About The Project

<!-- tell about the project, features -->

This project is about building a mail app that integrates with Notion's API and database, providing a command-line interface (CLI) for managing mails.

The project supports the following features:
* Sending messages to a designated recipient from a specified sender.
* Reading messages for a given recipient.
* Deleting messages for a recipient.
* Adding test cases for the functionality used in the program.


<!-- GETTING STARTED -->
## Getting Started

To get started, please follow these steps to run the program:

1. Unzip the folder
  
    ```
    unzip <folder name>
    ```
2. Navigate `notion-mail` directory:
  
    ```
    cd notion-mail
    ```
3. Install the required Node.js modules:
  
    ```
    npm install
    ```
4. Inside the `.env` file, you need to fill in necessary keysto use Notion's API. You could find more details [here](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions).

    ```
    NOTION_TOKEN=<your secret key>
    NOTION_DATABASE_ID=<your database key>
    ```
5. Run the program:

    ```
    npm start
    ```
6. Test the program:

    ```
    npm test
    ```

Now you're in! You can now able to run and test the program. 


## Solution
<!-- tell them your design choices and how everything is structures -->
This section would show what are the choices and solutions I had to make enable for this program to work.

1. Libraries used:
    *  `dotenv` - Used for accessing environment variables.
    * `inquirer` - Provides more user-friendly command-line-interface to enable better interactions with users.
    * `notionhq/client` - Simplifies use of Notion's API that would be able to handle all request logic needed to interact with Notion database.
    * `jest` - Used for testing in javascript.
2. Notion's Database:
    ![image](https://github.com/user-attachments/assets/702092a0-5bfe-48ef-9fe2-9abb9b4d9bb1)
    * Create a database that has these properties:
        * `Message`
        * `Sender`
        * `Recepient`
3. File structure:
    * `notion-api-helper/notion-api-helper.js` 
        * Contains all the functionalities that the main file will use in order for the request to Notion's API to work.
        * Separated from the main file in order to have better structuring and code could be reused.

        Mainly followed the resources provided [here](https://developers.notion.com/docs/create-a-notion-integration#getting-started) to enable and make API requests to Notion which mainly consist of the following functions:

        `Note`: The following are simplified examples and it is not the full implementation, to illustrate the types of functions it is using.
        ```
        // Initializing notion client
        const notion = new Client({
            auth: process.env.NOTION_TOKEN,
        });

        // For creating pages for Notion's API
        notion.pages.create({
        })

        // For querying the database of Notion's API
        notion.databases.query({
        })

        // For updating the database of Notion's API
        notion.databases.updates({
        })
        ```

        Main functionalities of our program (which primarily utilize the code snippets mentioned above) include:


        ```
        // This is the function that handles sending mail to Notion's database
        async function sendMail(notion, databaseId, sender, recipient, message) {...}

        // This is the function that will get the mail of a specific user and returns all the messages that it has
        async function readMail(notion, databaseId, user) {...}

        // This is the function that will delete the mail of a specific pageId
        async function deleteMail(notion, pageId) {...}

        // This is the function that will get the mail of a specific user and returns all the messages that it has
        async function getMessagesForUser(notion, databaseId, user) {...}
        ```
            
        Mainly used Notion's API to handle all requests that simplifies that proccess and eliminating the need to manually make requests or rely on other third-party-api.    
    * `notion-api-helper/notion-api-helper.test.js`     
        * Testing is important in SWE so I added  `jest` in our test and I currently have `1 test suite` that has `4 test cases` that tests all the functionalities from the `notion-api-helper/notion-api-helper.js`
        * Mainly mock the functions from the `notion-api-helper/notion-api-helper.js` then used jest function `toHaveBeenCalled` to make sure it is called properly.
    * `index.js`
        * This handles the initialization of `Notion` client and retrieves all the environment variables that is helpful to run the program.
        * Manages user input validation by using the functionalities provided in `notion-api-helper/notion-api-helper.js`.
        * Mainly separated the logic here from `notion-api-helper/notion-api-helper.js` to keep code clean and maintain a clear separation of concerns.

<!-- IMPROVEMENTS -->
## Improvements
* Add timestamps to each message to indicate when the message was sent.
* Review and improve code documentation to ensure it is thorough and clear.
    
<!-- DEMO EXAMPLES -->
## Demo
[Video demo](https://github.com/user-attachments/assets/bb18f845-3661-407a-9765-85457dd0e163)

<!-- RESOURCES -->
## Resources
* [notion setup](https://developers.notion.com/docs/create-a-notion-integration#step-5-displaying-the-response-indexhtml)
* [notion sdk](https://www.npmjs.com/package/@notionhq/client) 
* [query notion](https://developers.notion.com/reference/post-database-query-filter) 
* [update notion](https://developers.notion.com/reference/update-a-database) 
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [dotenv](https://www.npmjs.com/package/dotenv)