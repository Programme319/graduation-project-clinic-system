<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientMedication extends Model
{
    protected $fillable = ['med_code', 'med_name', 'dosage'];
}

?>
