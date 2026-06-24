<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class OllamaService
{
    private $apiKey;
    private $baseUrl;
    private $model;
    private $client;

    public function __construct()
    {
        $this->apiKey = env('OLLAMA_API_KEY');
        $this->baseUrl = env('OLLAMA_BASE_URL', 'https://ollama.com/api');
        $this->model = env('OLLAMA_MODEL', 'qwen3-coder:30b');
        $this->client = new Client();

        if (!$this->apiKey) {
            throw new \Exception('OLLAMA_API_KEY is not configured in .env file');
        }
    }

    /**
     * Send a chat message to Ollama Cloud API
     * 
     * @param string $prompt The user message/prompt
     * @return string The AI response text
     * @throws \Exception
     */
    public function chat(string $prompt): string
    {
        try {
            Log::info('Ollama Chat Request', [
                'model' => $this->model,
                'prompt_length' => strlen($prompt)
            ]);

            // Build the payload according to Ollama Chat API format
            $payload = [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'stream' => false
            ];

            // Make the request to Ollama Cloud API
            $response = $this->client->post($this->baseUrl . '/chat', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload,
                'timeout' => 60,
                'http_errors' => false
            ]);

            $statusCode = $response->getStatusCode();
            $responseBody = $response->getBody()->getContents();
            $data = json_decode($responseBody, true);

            Log::info('Ollama API Response', [
                'status_code' => $statusCode,
                'has_message' => isset($data['message']),
                'response_keys' => array_keys($data ?? [])
            ]);

            // Check for HTTP errors
            if ($statusCode >= 400) {
                Log::error('Ollama API returned error', [
                    'status_code' => $statusCode,
                    'error' => $data['error'] ?? $responseBody
                ]);
                throw new \Exception('Ollama API Error (HTTP ' . $statusCode . '): ' . 
                    ($data['error'] ?? 'Unknown error'));
            }

            // Extract the message content from response
            if (isset($data['message']) && is_array($data['message'])) {
                if (isset($data['message']['content'])) {
                    return trim($data['message']['content']);
                }
            }

            // Alternative: check for direct content field
            if (isset($data['content']) && is_string($data['content'])) {
                return trim($data['content']);
            }

            // Alternative: check for response field
            if (isset($data['response']) && is_string($data['response'])) {
                return trim($data['response']);
            }

            // If we can't find the response, log the structure for debugging
            Log::error('Could not extract text from Ollama response', [
                'response_structure' => json_encode($data),
                'status_code' => $statusCode
            ]);

            throw new \Exception('Invalid Ollama response format: ' . json_encode($data));

        } catch (\Exception $e) {
            Log::error('Ollama Service Error', [
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw $e;
        }
    }
}
?>
