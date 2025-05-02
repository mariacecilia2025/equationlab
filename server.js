// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [{ role: "user", content: question }],
                max_tokens: 150
            })
        });

        const data = await openaiRes.json();
        res.json({ answer: data.choices[0].message.content });

    } catch (error) {
        console.error("Erro ao acessar OpenAI:", error);
        res.status(500).json({ answer: "Erro ao buscar resposta da IA." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
