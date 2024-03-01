const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 8000;

const apiKey = process.env.OPENAI_API_KEY;
// const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

app.use(cors());

app.get('/:message', async (req, res) => {
    const { message } = req.params;

    const messages = [
        { role: 'system', content: 'You are a machine that recommends songs without saying much.When you enter a keyword, 10 titles and singers should be displayed.' },
        { role: 'user', content: message },
        { role: 'assistant', content: 'Just answer in the format “title by singer”' },
    ];

    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: messages,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        console.log(result);

        const songsArray = result.choices[0].message.content.split('\n');
        var songs = [];

        for (var i = 0; i < songsArray.length; i++) {
            const data = songsArray[i].replace(/^\d+\.\s/, '');
            const songInfo = data.split(' by ');

            const songObject = {
                title: songInfo[0],
                singer: songInfo[1]
            };

            songs.push(songObject);
        }

        // 배열 전체를 응답으로 보냅니다.
        res.json(songs);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
