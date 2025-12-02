<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'skills' => $this->skills ?? [],
            'projects' => $this->projects ?? [],
            'links' => $this->links ?? [],
            'is_public' => (bool) $this->is_public,
            'thumbnail_path' => $this->thumbnail_path,
            'thumbnail_url' => $this->thumbnail_url,
            'gallery_images' => $this->gallery_images ?? [],
            'gallery_image_urls' => $this->gallery_image_urls,
            'github_url' => $this->github_url,
            'external_url' => $this->external_url,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'profile_image' => $this->user->profile_image,
                    'department' => $this->user->department,
                ];
            }),
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }
}
