<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    protected $fillable = ['name', 'email', 'phone'];

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }
}