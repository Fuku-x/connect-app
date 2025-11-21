<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recruitment extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'required_skills',
        'project_duration',
        'compensation',
        'status'
    ];

    protected $casts = [
        'required_skills' => 'array',
    ];

    protected $attributes = [
        'status' => 'open'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
