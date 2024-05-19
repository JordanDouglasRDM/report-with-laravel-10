<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UniqueForUserRule
{
    protected readonly string $table;
    protected readonly string $column;
    protected int $userId;
    protected string $requestUri;

    public function __construct($table, $column)
    {
        $this->table = $table;
        $this->column = $column;
        $this->userId = auth()->guard()->user()->id;
        $this->requestUri = $this->getRequestUri();
    }

    protected function getRequestUri(): string
    {
        $request = app(Request::class);
        return $request->getRequestUri();
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
        $array = explode('/', $this->requestUri);
        $requestId = end($array);

        if ($requestId == intval($requestId)) {
            $changed = DB::table($this->table)
                ->where('id', $requestId)
                ->where('user_id', $this->userId)
                ->first();

            $column = $this->column;

            if ($changed->$column === $value) {
                return true;
            }
        }

        $exists = DB::table($this->table)
            ->where($this->column, $value)
            ->where('user_id', $this->userId)
            ->exists();
        return !$exists;
    }
}
