<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cnpj' => $this->faker->unique()->numerify('##############'), // 14 digit CNPJ
            'razao_social' => $this->faker->company(),
            'email_notificacao' => $this->faker->unique()->safeEmail(),
        ];
    }
}