<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Requester>
 */
class RequesterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = Department::all();
        $departmentsId = $departments->pluck('id')->toArray();

        return [
            'name' => fake()->unique()->firstName(),
            'department_id' => fake()->randomElement($departmentsId),
        ];
    }
}
