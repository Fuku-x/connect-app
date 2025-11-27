<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends BaseController
{
    public function index()
    {
        $portfolios = Auth::user()->portfolios()->latest()->get();

        return $this->sendResponse(
            PortfolioResource::collection($portfolios),
            'Portfolios retrieved successfully.'
        );
    }

    public function store(Request $request)
    {
        $data = $this->validatePortfolio($request);
        $portfolio = Auth::user()->portfolios()->create($data);

        return $this->sendResponse(new PortfolioResource($portfolio->load('user')), 'Portfolio created successfully.');
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $this->authorizeOwnership($portfolio);
        $data = $this->validatePortfolio($request, $portfolio->id);
        $portfolio->update($data);

        return $this->sendResponse(new PortfolioResource($portfolio->load('user')), 'Portfolio updated successfully.');
    }

    public function destroy(Portfolio $portfolio)
    {
        $this->authorizeOwnership($portfolio);
        $portfolio->delete();

        return $this->sendResponse(null, 'Portfolio deleted successfully.');
    }

    public function publicIndex(Request $request)
    {
        $query = Portfolio::query()
            ->with('user')
            ->where('is_public', true);

        if ($request->filled('skills')) {
            $skills = array_filter(explode(',', $request->input('skills')));
            foreach ($skills as $skill) {
                $query->whereJsonContains('skills', $skill);
            }
        }

        if ($request->filled('search')) {
            $query->where(function ($subQuery) use ($request) {
                $term = '%'.$request->input('search').'%';
                $subQuery->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term);
            });
        }

        $portfolios = $query->paginate($request->integer('per_page', 12));

        return PortfolioResource::collection($portfolios);
    }

    public function publicShow(Portfolio $portfolio)
    {
        abort_unless($portfolio->is_public, 404);

        return new PortfolioResource($portfolio->load('user'));
    }

    public function uploadThumbnail(Request $request)
    {
        $request->validate([
            'thumbnail' => 'required|image|max:2048',
        ]);

        $path = $request->file('thumbnail')->store('portfolio/thumbnails', 'public');

        return $this->sendResponse([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 'Thumbnail uploaded successfully.');
    }

    public function uploadGallery(Request $request)
    {
        $request->validate([
            'images' => 'required|array|min:1|max:6',
            'images.*' => 'image|max:4096',
        ]);

        $paths = collect($request->file('images'))
            ->map(fn ($image) => $image->store('portfolio/gallery', 'public'))
            ->map(fn ($path) => [
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
            ])->values()->all();

        return $this->sendResponse($paths, 'Gallery images uploaded successfully.');
    }

    protected function validatePortfolio(Request $request, ?int $portfolioId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
            'projects' => 'nullable|array',
            'projects.*.name' => 'required_with:projects|string|max:255',
            'projects.*.description' => 'nullable|string',
            'projects.*.url' => 'nullable|url|max:255',
            'projects.*.image' => 'nullable|string|max:255',
            'links' => 'nullable|array',
            'links.*.name' => 'required_with:links|string|max:100',
            'links.*.url' => 'required_with:links|url|max:255',
            'thumbnail_path' => 'nullable|string|max:255',
            'gallery_images' => 'nullable|array|max:6',
            'gallery_images.*' => 'string|max:255',
            'github_url' => 'nullable|url|max:255',
            'external_url' => 'nullable|url|max:255',
        ]);
    }

    protected function authorizeOwnership(Portfolio $portfolio): void
    {
        abort_unless($portfolio->user_id === Auth::id(), 403, 'You do not have permission to modify this portfolio.');
    }
}
