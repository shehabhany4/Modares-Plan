<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    public function index()
    {
        return Subject::with(['teacher', 'students'])->latest()->get();
    }

    public function store(Request $request)
    {
        $uid = $request->user()->id;
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => ['required', 'string', 'max:50', Rule::unique('subjects', 'code')->where('user_id', $uid)],
            'teacher_id' => ['nullable', Rule::exists('teachers', 'id')->where('user_id', $uid)],
        ]);

        return response()->json(Subject::create($data), 201);
    }

    public function show(Subject $subject)
    {
        return $subject->load(['teacher', 'students']);
    }

    public function update(Request $request, Subject $subject)
    {
        $uid = $subject->user_id;
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('subjects', 'code')->where('user_id', $uid)->ignore($subject->id)],
            'teacher_id' => ['nullable', Rule::exists('teachers', 'id')->where('user_id', $uid)],
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