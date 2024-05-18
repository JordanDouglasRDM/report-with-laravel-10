<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UniqueForUserRule
{
    protected readonly string $table;
    protected readonly string $column;
    protected int $userId;

    public function __construct($table, $column)
    {
        $this->table = $table;
        $this->column = $column;
        $this->userId = auth()->guard()->user()->id;
    }

    /**
     * Run the validation rule.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */

    public function passes(string $attribute, mixed $value): bool
    {
        $exists = DB::table($this->table)
            ->where($this->column, $value)
            ->where('user_id', $this->userId)
            ->exists();
        return !$exists;

    }
//      public function validate(string $attribute, mixed $value, Closure $fail = null): void
//    {
////        $exists = DB::table($this->table)
////            ->where($this->column, $value)
////            ->where('user_id', $this->userId)
////            ->exists();
//        $exists = false;
//
//    }
}
