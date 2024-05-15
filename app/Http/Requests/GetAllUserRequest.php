<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GetAllUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'per_page' => 'nullable|numeric|max:100',
            'filter_search' => 'nullable|string|max:100',
            'order_by' => 'nullable|in:id,name,email,phone_number,level,created_at',
            'order_direction' => 'nullable|in:asc,desc',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 422,
            'message' => 'Os dados fornecidos são inválidos!',
            'error' => $validator->errors()
        ],422));
    }
}
