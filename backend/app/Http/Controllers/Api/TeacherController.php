<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    public function index()
    {
        return Teacher::with('subjects')->latest()->get();
    }

    public function store(Request $request)
    {
        $uid = $request->user()->id;
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('teachers', 'email')->where('user_id', $uid)],
            'phone' => 'nullable|string|max:30',
        ]);

        return response()->json(Teacher::create($data), 201);
    }

    public function show(Teacher $teacher)
    {
        return $teacher->load('subjects');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $uid = $teacher->user_id;
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('teachers', 'email')->where('user_id', $uid)->ignore($teacher->id)],
            'phone' => 'nullable|string|max:30',
        ]);

        $teacher->update($data);

        return $teacher->load('subjects');
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return response()->json(['message' => 'Deleted']);
    }
}