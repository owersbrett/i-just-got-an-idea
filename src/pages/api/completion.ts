import axios from 'axios';
import { rateLimit } from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10
}); // limit each IP to 10 requests per windowMs



const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).send('Bad request: prompt is missing');
  }
  let model = req.body.model;
  if (!model) {
    model = "text-davinci-003";
    // model = "text-davinci-003";
  }
  let maxTokens = req.body.maxTokens;
  if (!maxTokens){
    maxTokens = 1024;
  }
  let temperature = req.body.temperature;
  if (!temperature){
    temperature = 0.1;
    }
  try {
    let data = {
        "model": model,
        "prompt": prompt,
        "max_tokens": maxTokens,
        "temperature": temperature,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "logprobs": null,
    }

    console.log('Prompt:', prompt);
    let completion = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + OPENAI_API_KEY,
        },
        data: data

    });

    let response = completion.data.choices[0].text;
    const cleanedText = response.replace(/[\r\n]+/gm, " ");


    console.log('Completion:', completion.data.choices);
    console.log('Completion:', cleanedText);

    return limiter(req, res, () => {
      return res.status(200).json({ response: cleanedText });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
}

const allowCors = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  return await handler(req, res)
}

export default allowCors(handler)
