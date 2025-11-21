<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'skills',
        'projects',
        'links'
    ];

    protected $casts = [
        'skills' => 'array',
        'projects' => 'array',
        'links' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
