# Grammar Agent API

A Flask-based API that uses Google's Gemini AI to answer grammar questions.

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
export GEMINI_API_KEY='your-api-key-here'
```

3. Run the server:
```bash
python gemini.py
```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn gemini:app`
4. Add the following environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key

## API Endpoints

### POST /answer
Send a grammar question and get the answer.

Request body:
```json
{
    "question": "Your grammar question here"
}
```

Response:
```json
{
    "answer": "The answer"
}
```

## Rate Limiting

The API implements rate limiting to comply with Gemini API's free tier limitations. There is a minimum 2-second delay between requests. 