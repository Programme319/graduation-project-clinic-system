<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
        $table->id(); // This is the "Ticket Number" (رقم التذكرة)
        $table->string('full_name'); // اسم المريض
        $table->string('national_id', 14)->unique(); // الرقم القومي
        $table->integer('age'); // العمر
        $table->string('clinic_code')->nullable(); // العيادة
        $table->text('complaint')->nullable(); // شكوى المريض
        $table->text('diagnosis_text')->nullable(); // التشخيص
        $table->string('doctor_name')->nullable(); // اسم الطبيب
        $table->string('pharmacist_name')->nullable(); // اسم الصيدلي
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
