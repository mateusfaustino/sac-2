<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Client;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $client = Client::inRandomOrder()->first() ?? Client::factory()->create();
        $user = User::where('client_id', $client->id)->inRandomOrder()->first() ?? 
                User::factory()->create(['client_id' => $client->id, 'role' => 'client']);

        return [
            'ticket_number' => 'TCK-' . $this->faker->unique()->numerify('######'),
            'client_id' => $client->id,
            'user_id' => $user->id,
            'numero_contrato' => $this->faker->bothify('CTR-####-??'),
            'numero_nf' => $this->faker->numerify('NF#########'),
            'numero_serie' => $this->faker->optional()->bothify('SER-########'),
            'descricao' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->randomElement([
                'aberto', 
                'em_analise', 
                'aprovado', 
                'reprovado', 
                'aguardando_envio', 
                'em_transito', 
                'recebido', 
                'concluido', 
                'cancelado'
            ]),
        ];
    }
}