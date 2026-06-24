<?php
namespace App\Models;

use App\Models\PatientMedication;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = ['full_name', 'national_id', 'age', 'clinic_code', 'complaint', 'diagnosis_text', 'doctor_name', 'pharmacist_name'];

    public function investigations() {
        return $this->hasMany(PatientInvestigation::class);
    }

    public function medications() {
        return $this->hasMany(PatientMedication::class);
    }
}
?>