<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admins only');

        return User::withCount(['students', 'teachers', 'subjects'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'is_admin' => $u->isAdmin(),
                'students_count' => $u->students_count,
                'teachers_count' => $u->teachers_count,
                'subjects_count' => $u->subjects_count,
                'created_at' => $u->created_at,
            ]);
    }

    public function destroy(Request $request, User $user)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admins only');

        if ($user->isAdmin()) {
            return response()->json(['message' => 'Admin accounts cannot be deleted'], 422);
        }

        $user->tokens()->delete();
        $user->delete(); // students, teachers, subjects are removed by cascade

        return response()->json(['message' => 'Account deleted']);
    }
}