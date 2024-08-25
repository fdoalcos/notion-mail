const { default: Choices } = require("inquirer/lib/objects/choices");

/**
 * This is the function that handles sending mail to Notion's database
 * 
 * @param notion Notion instance that would handle the api request
 * @param databaseId Id of the Notion's database we want to send request to
 * @param sender The sender of the message 
 * @param recipient The receiver of the message
 * @param message Message that will be sent to the notion's database
 * 
 */
async function sendMail(notion, databaseId, sender, recipient, message) {
    try {
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Message: {
            title: [
              {
                text: {
                  content: message
                }
              }
            ]
          },
          Sender: {
            rich_text: [
              {
                text: {
                  content: sender
                }
              }
            ]
          },
          Recipient: {
            rich_text: [
              {
                text: {
                  content: recipient
                }
              }
            ]
          },
        }
      });
  
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error.body || error.message);
    }
}
  
/**
 * This is the function that will get the mail of a specific user and returns
 * all the messages that it has
 * 
 * @param notion Notion instance that would handle the api request
 * @param databaseId Id of the Notion's database we want to send request to
 * @param user The user who will we will filter to get specific messages for them
 * 
 */
async function readMail(notion, databaseId, user) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Recipient',
          rich_text: {
            equals: user
          }
        }
      });
  
      const results = response.results;
      if (results.length === 0) {
        console.log(`No messages found for ${user}.`);
      } else {
        console.log(`Messages for ${user} (${results.length}):\n`);
        results.forEach((message) => {
          const sender = message.properties.Sender.rich_text[0].text.content;
          const msg = message.properties.Message.title[0].text.content;
          console.log(`from: ${sender}\n${msg}\n`);
        });
      }
    } catch (error) {
      console.error('Error reading messages:', error.body || error.message);
    }
}

/**
 * This is the function that will delete the mail of a specific pageId
 * 
 * @param notion Notion instance that would handle the api request
 * @param pageId Id of the Notion's database column that we want to archive
 * 
 */
async function deleteMail(notion, pageId) {
    try {
        const response = await notion.pages.update({
            page_id: pageId,
            archived: true, 
        });
  
        console.log('Message deleted successfully!');
        return response;
    } catch (error) {
        console.error('Error deleting message:', error.body || error.message);
    }
}

/**
 * This is the function that will get the mail of a specific user and returns
 * all the messages that it has
 * 
 * @param notion Notion instance that would handle the api request
 * @param databaseId Id of the Notion's database we want to send request to
 * @param user The user who will we will filter to get specific messages for them
 * 
 */
async function getMessagesForUser(notion, databaseId, user) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Recipient',
        rich_text: {
          equals: user,
        },
      },
    });

    const messages = response.results;

    // List the messages and their IDs for easy selection
    const choices = messages.map((message) => {
      const sender = message.properties.Sender.rich_text[0].text.content;
      const msg = message.properties.Message.title[0].text.content;
      return {
        name: `From: ${sender} - "${msg}"`,
        value: message.id,
      };
    });

    return choices;
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    return [];
  }
}

module.exports = {
    sendMail,
    readMail,
    deleteMail,
    getMessagesForUser
};