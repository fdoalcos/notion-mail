require('dotenv').config();
const { Client } = require('@notionhq/client');
const { sendMail, readMail, deleteMail, getMessagesForUser } = require('./notion-api-helper/notion-api-helper');
const inquirer = require('inquirer');

// Initializing notion client and get database id
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * This is the main function that handles the user action on wether
 * they want to send an email, read an email, or delete an email with
 * Notion's database.
 * 
 */
async function main() {
  let shouldContinue = true;

  while (shouldContinue) {
    console.log('Welcome to NotionMail!');
    
    // userAction that is prompted on what actions they want to take
    const { userAction } = await inquirer.prompt([{
      name: 'userAction',
      type: 'list',
      message: 'Please select an option:',
      choices: ['send', 'read', 'delete', 'exit']
    }]);
  
    if (userAction === 'send') {
      const { sender, recipient, message } = await inquirer.prompt([
        { name: 'sender', message: 'Sender:' },
        { name: 'recipient', message: 'Recipient:' },
        { name: 'message', message: 'Message:' }
      ]);
      await sendMail(notion, databaseId, sender, recipient, message);
    } else if (userAction === 'read') {
      const { user } = await inquirer.prompt([
        { name: 'user', message: 'User:' }
      ]);
      await readMail(notion, databaseId, user);
    } else if (userAction === 'delete') {
      const { user } = await inquirer.prompt([
          { type: 'input', name: 'user', message: 'Enter your name to view messages for deletion:' },
      ]);
  
      const choices = await getMessagesForUser(notion, databaseId, user);
  
      // Ask the user which message they want to delete
      const { messageId } = await inquirer.prompt([
          {
              type: 'list',
              name: 'messageId',
              message: 'Select the message you want to delete:',
              choices,
          },
      ]);
      await deleteMail(notion, messageId);
    } else if (userAction === 'exit') {
      shouldContinue = false;
      console.log('Thanks for using NotionMail! Goodbye!')
      break;
    }
  }
}
  
main();




