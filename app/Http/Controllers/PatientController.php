<?php
namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validation (Ensuring National ID is 14 digits, etc.)
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'national_id' => 'required|string|size:14|unique:patients',
            'age' => 'required|integer',
            'diagnosis_text' => 'nullable|string',
        ]);

        // 2. Database Transaction (Save everything or nothing)
        DB::transaction(function () use ($request) {
            $patient = Patient::create($request->all());

            // Only save tests that actually have a code filled in
            if ($request->has('tests')) {
                $validTests = collect($request->tests)->filter(fn($test) => !empty($test['test_code']));
                if ($validTests->isNotEmpty()) {
                    $patient->investigations()->createMany($validTests->toArray());
                }
            }

            // Only save medications that actually have a code filled in
            if ($request->has('medications')) {
                $validMeds = collect($request->medications)->filter(fn($med) => !empty($med['med_code']));
                if ($validMeds->isNotEmpty()) {
                    $patient->medications()->createMany($validMeds->toArray());
                }
            }
        });

        return redirect()->back()->with('message', 'تم حفظ بيانات المريض بنجاح!');
    }

    public function index(Request $request)
    {
        $query = Patient::query();

        // Handle Search by Name or National ID
        if ($request->search) {
            $query->where('full_name', 'like', "%{$request->search}%")
                ->orWhere('national_id', 'like', "%{$request->search}%");
        }

        return Inertia::render('Patient/Index', [
            'patients' => $query->latest()->get(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function show(Patient $patient)
    {
        // Load the related investigations and medications
        return Inertia::render('Patient/Show', [
            'patient' => $patient->load(['investigations', 'medications'])
        ]);
    }
}
?>