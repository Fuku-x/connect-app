<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends BaseController
{
    public function index()
    {
        $tasks = Task::where('user_id', Auth::id())
            ->orderBy('due_date', 'asc')
            ->orderBy('priority', 'desc')
            ->get();
            
        return $this->sendResponse($tasks, 'Tasks retrieved successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:todo,in_progress,done',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'todo',
            'priority' => $request->priority ?? 'medium',
            'due_date' => $request->due_date,
        ]);

        return $this->sendResponse($task, 'Task created successfully.');
    }

    public function show($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        return $this->sendResponse($task, 'Task retrieved successfully.');
    }

    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:todo,in_progress,done',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task->update($request->only([
            'title', 'description', 'status', 'priority', 'due_date'
        ]));

        return $this->sendResponse($task, 'Task updated successfully.');
    }

    public function destroy($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        $task->delete();

        return $this->sendResponse([], 'Task deleted successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task->update(['status' => $request->status]);

        return $this->sendResponse($task, 'Task status updated successfully.');
    }
}
