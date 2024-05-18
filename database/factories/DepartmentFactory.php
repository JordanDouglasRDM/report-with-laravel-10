<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Department>
 */
class DepartmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
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
        return [
            'name' => fake()->unique()->randomElement($randomDepartment),
        ];
    }
}
