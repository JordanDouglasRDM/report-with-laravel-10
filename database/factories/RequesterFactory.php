<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\User;
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
        $usersId = $departments->pluck('user_id')->toArray();

        return [
            'name' => fake()->unique()->name(),
            'department_id' => fake()->randomElement($departmentsId),
            'user_id' => fake()->randomElement($usersId),
        ];
    }
}
