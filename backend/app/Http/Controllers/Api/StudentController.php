<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with('subject')->latest()->get();
    }

    public function store(Request $request)
    {
        $uid = $request->user()->id;
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('students', 'email')->where('user_id', $uid)],
            'grade' => 'nullable|integer|min:1|max:12',
            'birth_date' => 'nullable|date',
            'subject_id' => ['nullable', Rule::exists('subjects', 'id')->where('user_id', $uid)],
        ]);

        return response()->json(Student::create($data), 201);
    }

    public function show(Student $student)
    {
        return $student->load('subject');
    }

    public function update(Request $request, Student $student)
    {
        $uid = $student->user_id;
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('students', 'email')->where('user_id', $uid)->ignore($student->id)],
            'grade' => 'nullable|integer|min:1|max:12',
            'birth_date' => 'nullable|date',
            'subject_id' => ['nullable', Rule::exists('subjects', 'id')->where('user_id', $uid)],
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