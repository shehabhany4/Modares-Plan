<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());
        $records = Attendance::whereDate('date', $date)->pluck('status', 'student_id');

        return Student::orderBy('name')->get(['id', 'name', 'grade'])->map(fn ($s) => [
            'student_id' => $s->id,
            'name' => $s->name,
            'grade' => $s->grade,
            'status' => $records[$s->id] ?? null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => 'required|in:present,absent,late',
        ]);

        foreach ($data['records'] as $r) {
            Attendance::updateOrCreate(
                ['student_id' => $r['student_id'], 'date' => $data['date']],
                ['status' => $r['status']]
            );
        }

        return response()->json(['message' => 'Attendance saved']);
    }

    public function summary()
    {
        return Student::withCount([
            'attendances as present_count' => fn ($q) => $q->whereIn('status', ['present', 'late']),
            'attendances as absent_count' => fn ($q) => $q->where('status', 'absent'),
            'attendances as total_count',
        ])->orderBy('name')->get()->map(fn ($s) => [
            'student_id' => $s->id,
            'name' => $s->name,
            'present' => $s->present_count,
            'absent' => $s->absent_count,
            'total' => $s->total_count,
            'rate' => $s->total_count ? round($s->present_count / $s->total_count * 100) : null,
        ]);
    }
}