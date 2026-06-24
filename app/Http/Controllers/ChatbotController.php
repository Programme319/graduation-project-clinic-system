<?php
namespace App\Http\Controllers;

use App\Models\Patient;
use App\Services\OllamaService;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    private $ollamaService;

    public function __construct()
    {
        $this->ollamaService = new OllamaService();
    }

    /**
     * Get patient public info by ticket number (ID)
     */
    public function getPatient($patientId)
    {
        $patient = Patient::find($patientId);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على المريض بهذا الرقم'
            ], 404);
        }

        // Return only public info
        return response()->json([
            'success' => true,
            'patient' => [
                'id' => $patient->id,
                'full_name' => $patient->full_name,
                'age' => $patient->age,
                'diagnosis_text' => $patient->diagnosis_text,
                'doctor_name' => $patient->doctor_name,
                'complaint' => $patient->complaint,
            ]
        ]);
    }

    /**
     * Chat with AI about a patient
     */
    public function chat(Request $request)
    {
        try {
            // Log the request
            \Log::info('Chat request received', [
                'patient_id' => $request->input('patient_id'),
                'message_length' => strlen($request->input('message', ''))
            ]);

            $validated = $request->validate([
                'patient_id' => 'required|integer|exists:patients,id',
                'message' => 'required|string|max:2000',
            ]);

            \Log::info('Validation passed');

            $patient = Patient::find($validated['patient_id']);

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'المريض غير موجود'
                ], 404);
            }

            // Build system prompt with patient context
            $systemPrompt = $this->buildSystemPrompt($patient);
            $fullPrompt = $systemPrompt . "\n\nسؤال المريض:\n" . $validated['message'];

            \Log::info('About to call Ollama API');

            // Call Ollama API
            $response = $this->ollamaService->chat($fullPrompt);

            \Log::info('Ollama response received');

            return response()->json([
                'success' => true,
                'reply' => $response
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Validation failed', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة'
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Chat Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Build system prompt with patient info
     */
    private function buildSystemPrompt(Patient $patient): string
    {
        $complaint = $patient->complaint ? $patient->complaint : 'غير محددة';
        $diagnosis = $patient->diagnosis_text ? $patient->diagnosis_text : 'تحت التقييم';
        $doctor = $patient->doctor_name ? $patient->doctor_name : 'غير محدد';

        return <<<EOT
أنت مساعد طبي ذكي مفيد. لديك معلومات عن المريض:

**معلومات المريض:**
- الاسم: {$patient->full_name}
- العمر: {$patient->age} سنة
- الشكوى: {$complaint}
- التشخيص: {$diagnosis}
- الطبيب المعالج: {$doctor}

**تعليمات:**
1. قدم نصائح صحية عملية بناءً على حالة المريض
2. كن متعاطفاً ولطيفاً في إجاباتك
3. لا تقدم تشخيصات طبية، بل نصائح عامة
4. شجع المريض على متابعة الطبيب
5. إذا كانت الحالة حرجة، اطلب منه التوجه للمستشفى فوراً
6. أجب باللغة العربية دائماً

تذكير: أنت مساعد فقط، وليس بديلاً عن الرعاية الطبية المتخصصة.
EOT;
    }
}
?>