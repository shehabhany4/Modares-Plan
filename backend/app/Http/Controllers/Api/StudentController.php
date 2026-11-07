<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with('subject')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'grade' => 'nullable|integer|min:1|max:12',
            'birth_date' => 'nullable|date',
            'subject_id' => 'nullable|exists:subjects,id',
        ]);

        return response()->json(Student::create($data), 201);
    }

    public function show(Student $student)
    {
        return $student->load('subject');
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:students,email,' . $student->id,
            'grade' => 'nullable|integer|min:1|max:12',
            'birth_date' => 'nullable|date',
            'subject_id' => 'nullable|exists:subjects,id',
        ]);

        $student->update($data);

        return $student->load('subject');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json(['message' => 'Deleted']);
    }
}