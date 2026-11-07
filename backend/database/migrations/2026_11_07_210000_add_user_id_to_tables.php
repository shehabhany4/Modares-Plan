<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['students', 'teachers', 'subjects'] as $name) {
            Schema::table($name, function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            });
        }

        // Existing rows go to the demo account (or the first user)
        $owner = DB::table('users')->where('email', 'demo@ysa.com')->value('id')
            ?? DB::table('users')->orderBy('id')->value('id');

        if ($owner) {
            foreach (['students', 'teachers', 'subjects'] as $name) {
                DB::table($name)->whereNull('user_id')->update(['user_id' => $owner]);
            }
        }

        // Emails / codes only need to be unique per teacher
        Schema::table('students', function (Blueprint $table) {
            $table->dropUnique(['email']);
            $table->unique(['user_id', 'email']);
        });
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropUnique(['email']);
            $table->unique(['user_id', 'email']);
        });
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropUnique(['code']);
            $table->unique(['user_id', 'code']);
        });
    }

    public function down(): void
    {
        // One-way migration
    }
};