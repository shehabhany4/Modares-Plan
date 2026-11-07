<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToUser
{
    protected static function bootBelongsToUser(): void
    {
        static::addGlobalScope('owner', function (Builder $builder) {
            $user = Auth::user();

            // Admin sees everything
            if ($user && $user->isAdmin()) {
                return;
            }

            // Teachers see only their own rows (no user = no rows)
            $builder->where($builder->getModel()->getTable() . '.user_id', Auth::id() ?? 0);
        });

        static::creating(function ($model) {
            if (empty($model->user_id) && Auth::id()) {
                $model->user_id = Auth::id();
            }
        });
    }
}