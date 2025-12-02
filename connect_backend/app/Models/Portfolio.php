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
        'links',
        'is_public',
        'thumbnail_path',
        'gallery_images',
        'github_url',
        'external_url',
    ];

    protected $casts = [
        'skills' => 'array',
        'projects' => 'array',
        'links' => 'array',
        'gallery_images' => 'array',
        'is_public' => 'boolean',
    ];

    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->thumbnail_path ? asset('storage/'.$this->thumbnail_path) : null;
    }

    public function getGalleryImageUrlsAttribute(): array
    {
        if (empty($this->gallery_images)) {
            return [];
        }

        return collect($this->gallery_images)
            ->map(fn ($path) => asset('storage/'.$path))
            ->all();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
