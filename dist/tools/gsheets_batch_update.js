import { google } from "googleapis";
export const schema = {
    name: "gsheets_batch_update",
    description: "Update multiple cells in a Google Spreadsheet",
    inputSchema: {
        type: "object",
        properties: {
            fileId: {
                type: "string",
                description: "ID of the spreadsheet",
            },
            updates: {
                type: "array",
                description: "Array of range/value pairs to update",
                items: {
                    type: "object",
                    properties: {
                        range: {
                            type: "string",
                            description: "Cell range in A1 notation (e.g. 'Sheet1!A1')",
                        },
                        value: {
                            type: "string",
                            description: "New cell value",
                        },
                    },
                    required: ["range", "value"],
                },
            },
        },
        required: ["fileId", "updates"],
    },
};
export async function batchUpdate(args) {
    const { fileId, updates } = args;
    const sheets = google.sheets({ version: "v4" });
    const data = updates.map(({ range, value }) => ({
        range,
        values: [[value]],
    }));
    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: fileId,
        requestBody: {
            valueInputOption: "USER_ENTERED",
            data,
        },
    });
    return {
        content: [
            {
                type: "text",
                text: `Updated ${updates.length} cells in spreadsheet ${fileId}`,
            },
        ],
        isError: false,
    };
}
