<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PortfolioController extends BaseController
{
    public function index()
    {
        $portfolio = Auth::user()->portfolio;
        return $this->sendResponse($portfolio, 'Portfolio retrieved successfully.');
    }

    public function show($id)
    {
        $portfolio = Portfolio::findOrFail($id);
        return $this->sendResponse($portfolio, 'Portfolio retrieved successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'skills' => 'nullable|array',
            'projects' => 'nullable|array',
            'links' => 'nullable|array',
        ]);

        $portfolio = Auth::user()->portfolio()->updateOrCreate(
            ['user_id' => Auth::id()],
            $request->all()
        );

        return $this->sendResponse($portfolio, 'Portfolio updated successfully.');
    }
}
