<?php

use App\Http\Controllers\ChatbotController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Chatbot Routes - Public (no auth required for now)
Route::post('/chat', [ChatbotController::class, 'chat']);
Route::get('/patient/{patientId}', [ChatbotController::class, 'getPatient']);
