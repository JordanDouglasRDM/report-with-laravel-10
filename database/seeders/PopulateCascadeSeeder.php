<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Report;
use App\Models\Requester;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PopulateCascadeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->users(9);
    }
    private function users(int $qty): void
    {
        for ($i = 1; $i <= $qty; $i++) {
            if ($i == 1) {
                $user = User::create([
                    'name' => 'Jordan Douglas Rosa de Melo',
                    'email' => 'jordandouglas8515@gmail.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('455265*Aj'),
                    'remember_token' => Str::random(10),
                    'phone_number' => '(18) 99745-5265',
                    'level' => 'admin'
                ]);

                $this->departments(10, $user);
            }
            $firstName = fake()->firstName();
            $lastName = fake()->lastName();
            $email = $firstName . '.' . $lastName . Str::random(3) . '@gmail.com';

            $user = User::create([
                'name' => $firstName . ' ' . $lastName,
                'email' => strtolower($email),
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
                'phone_number' => fake()->phoneNumber(),
                'level' => 'operator',
                'created_at' => fake()->dateTimeBetween(),
            ]);

            $this->departments(fake()->numberBetween(5, 12), $user);

        }
    }

    private function departments(int $qtyPerUser, User $user): void
    {
        $randomDepartment = [
            'Recursos Humanos',
            'Financeiro',
            'Contabilidade',
            'Marketing',
            'Vendas',
            'Suporte ao Cliente',
            'Desenvolvimento de Produtos',
            'Pesquisa e Desenvolvimento',
            'Logística',
            'Compras',
            'Produção',
            'Qualidade',
            'Jurídico',
            'TI',
            'Treinamento e Desenvolvimento',
            'Relações Públicas',
            'Administração',
            'Serviços Gerais',
            'Planejamento Estratégico',
            'Auditoria Interna'
        ];

        for ($i = 1; $i <= $qtyPerUser; $i++) {
            $department = Department::create([
                'name' => fake()->randomElement($randomDepartment),
                'user_id' => $user->id,
                'created_at' => fake()->dateTimeBetween($user->created_at, 'now'),
            ]);
            $this->requesters(fake()->numberBetween(5, 12), $department);
        }

    }

    private function requesters(int $qtyPerDepartment, Department $department): void
    {
        for ($i = 1; $i <= $qtyPerDepartment; $i++) {
            $requester = Requester::create([
                'name' => fake()->name() . ' - ' . Str::random(5),
                'department_id' => $department->id,
                'user_id' => $department->user_id,
                'created_at' => fake()->dateTimeBetween($department->created_at, 'now'),
            ]);
            $this->reports(fake()->numberBetween(5, 20), $requester);
        }
    }
    private function reports(int $qtyPerRequester, Requester $requester): void
    {
        for ($i = 1; $i <= $qtyPerRequester; $i++) {
            Report::create([
                'status' => fake()->randomElement(['pending', 'completed', 'in_progress']),
                'priority' => fake()->randomElement(['low', 'medium', 'high', 'note']),
                'user_id' => $requester->user_id,
                'requester_id' => $requester->id,
                'abstract' => fake()->sentence(), //default 6 words
                'description' => fake()->text(450),
                'created_at' => fake()->dateTimeBetween($requester->created_at, 'now'),
            ]);
        }
    }
}
