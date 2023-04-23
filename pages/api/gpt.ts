import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const headers = {
  'Content-Type': 'application/json',
};

type Data = {
  msg: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(405).send({ msg: 'Only POST requests allowed' });
    return;
  }
  const body = req.body as { input: string };

  try {
    const completion = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: createPrompt(body.input) }],
        temperature: 0.5,
      },
      {
        headers: headers,
      },
    );
    const results = completion.data.choices[0];
    const content = results?.message?.content;
    if (content) {
      res.status(200).json({ msg: JSON.parse(content) });
    } else {
      res.status(400).json({ msg: 'No content' });
    }
  } catch (e) {
    res.status(500).json({ msg: 'Request failed to forward' });
  }
}

function createPrompt(userInput: string) {
  return `
    You are an expert in everything and your goal is to help me learn a topic by visualising it as a mind map.
    
    I will provide a prompt, and your goal is to generate a mind map of topics or ideas. Keep your topics and ideas descriptive but short and no longer than 2 sentences.
    
    For now, the mind map will only by 1 level deep.
    
    Your response should only be an array of strings in JSON format. The maximum length of array should not exceed 10.
    
    The PROMPT is:
    ${userInput}
  `;
}

export default handler;
