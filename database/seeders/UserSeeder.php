<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Jordan Douglas',
            'email' => 'jordandouglas8515@gmail.com',
            'password' => Hash::make('admin'),
            'phone_number' => '18997455265',
            'level' => 'admin'
        ]);
        User::factory(19)->create();
    }
}
