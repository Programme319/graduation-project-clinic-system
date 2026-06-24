<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ChatbotController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Redirect root to login
Route::get('/', function () {
    return redirect()->route('login');
});

// 2. Protected Routes (Must be logged in to access)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Redirect dashboard to the patient list
    Route::get('/dashboard', function () {
        return redirect()->route('patient.index');
    })->name('dashboard');

    // --- Patient Management ---
    Route::get('/patients', [PatientController::class, 'index'])->name('patient.index');
    Route::get('/patient/create', function () {
        return Inertia::render('Patient/Create');
    })->name('patient.create');
    Route::post('/patient/store', [PatientController::class, 'store'])->name('patient.store');
    Route::get('/patient/{patient}', [PatientController::class, 'show'])->name('patient.show');

    // --- User/Doctor Management (The New Routes) ---
    Route::get('/users/create', [ProfileController::class, 'create_user'])->name('users.create');
    Route::post('/users/store', [ProfileController::class, 'store_user'])->name('users.store');

    // --- Profile Management ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 3. Chatbot API Routes (Public access - no auth required)
Route::post('/api/chat', [ChatbotController::class, 'chat']);
Route::get('/api/patient/{patientId}', [ChatbotController::class, 'getPatient']);

require __DIR__.'/auth.php';