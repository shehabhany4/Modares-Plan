<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return Subject::with(['teacher', 'students'])->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects,code',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        return response()->json(Subject::create($data), 201);
    }

    public function show(Subject $subject)
    {
        return $subject->load(['teacher', 'students']);
    }

    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:50|unique:subjects,code,' . $subject->id,
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $subject->update($data);

        return $subject->load(['teacher', 'students']);
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response()->json(['message' => 'Deleted']);
    }
}