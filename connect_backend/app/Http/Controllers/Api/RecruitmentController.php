<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Recruitment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecruitmentController extends BaseController
{
    public function index()
    {
        $recruitments = Recruitment::with('user')
            ->where('status', 'open')
            ->latest()
            ->get();
            
        return $this->sendResponse($recruitments, 'Recruitments retrieved successfully.');
    }

    public function show($id)
    {
        $recruitment = Recruitment::with('user')->findOrFail($id);
        return $this->sendResponse($recruitment, 'Recruitment retrieved successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'required_skills' => 'required|array',
            'project_duration' => 'required|string',
            'compensation' => 'nullable|string',
        ]);

        $recruitment = Recruitment::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'required_skills' => $request->required_skills,
            'project_duration' => $request->project_duration,
            'compensation' => $request->compensation,
        ]);

        return $this->sendResponse($recruitment, 'Recruitment created successfully.');
    }

    public function update(Request $request, $id)
    {
        $recruitment = Recruitment::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'required_skills' => 'sometimes|required|array',
            'project_duration' => 'sometimes|required|string',
            'compensation' => 'nullable|string',
            'status' => 'sometimes|in:open,closed',
        ]);

        $recruitment->update($request->all());

        return $this->sendResponse($recruitment, 'Recruitment updated successfully.');
    }

    public function destroy($id)
    {
        $recruitment = Recruitment::where('user_id', Auth::id())->findOrFail($id);
        $recruitment->delete();

        return $this->sendResponse([], 'Recruitment deleted successfully.');
    }
}
