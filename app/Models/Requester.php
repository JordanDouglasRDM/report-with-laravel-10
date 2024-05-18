<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Requester extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'department_id',
        'user_id'
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
