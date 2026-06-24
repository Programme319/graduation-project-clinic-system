<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientInvestigation extends Model
{
    protected $fillable = ['test_code', 'test_name', 'test_result'];
}
?>