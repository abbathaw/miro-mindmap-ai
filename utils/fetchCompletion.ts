import axios from 'axios';
import { ApiRequestBody } from '../types';

const headers = {
  'Content-Type': 'application/json',
};
export const fetchAI = async (input: string) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/gpt', // TODO fix this hardcoded url
      {
        input,
      } as ApiRequestBody,
      { headers },
    );
    return response.data;
  } catch (e) {
    console.log('fetching data failed', e);
    return null;
  }
};
