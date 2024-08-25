const { sendMail, readMail, deleteMail, getMessagesForUser } = require('./notion-api-helper');
const { Client } = require('@notionhq/client');

jest.mock('@notionhq/client', () => {
    return {
        Client: jest.fn().mockImplementation(() => {
            return {
                pages: {
                    create: jest.fn().mockResolvedValue({}),
                    update: jest.fn().mockResolvedValue({}),
                },
                databases: {
                    query: jest.fn().mockResolvedValue({
                        results: [
                            {
                                id: 'test-id-1',
                                properties: {
                                    Sender: {
                                        rich_text: [
                                            {
                                                text: { content: 'John' }
                                            }
                                        ]
                                    },
                                    Message: {
                                        title: [
                                            {
                                                text: { content: 'Hello World' }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }),
                },
            };
        }),
    };
});

describe('Notion API helper tests', () => {
    test('sendMail should have been called', async () => {
        const notion = new Client();
        const databaseId = 'test-db-id';
        await sendMail(notion, databaseId, 'John', 'Jane', 'Test message');
        expect(notion.pages.create).toHaveBeenCalled();
    });

    test('readMail should have been called', async () => {
        const notion = new Client();
        const databaseId = 'test-db-id';
        await readMail(notion, databaseId, 'Jane');
        expect(notion.databases.query).toHaveBeenCalled();
    });

    test('deleteMail should archive the page', async () => {
        const notion = new Client();
        const pageId = 'test-page-id';

        await deleteMail(notion, pageId);

        expect(notion.pages.update).toHaveBeenCalledWith({
            page_id: pageId,
            archived: true,
        });
    });

    test('getMessagesForUser should return formatted choices', async () => {
        const notion = new Client();
        const databaseId = 'test-db-id';
        const user = 'Jane';

        const choices = await getMessagesForUser(notion, databaseId, user);

        expect(notion.databases.query).toHaveBeenCalledWith({
            database_id: databaseId,
            filter: {
                property: 'Recipient',
                rich_text: {
                    equals: user,
                },
            },
        });

        expect(choices).toEqual([
            {
                name: 'From: John - "Hello World"',
                value: 'test-id-1',
            }
        ]);
    });
});