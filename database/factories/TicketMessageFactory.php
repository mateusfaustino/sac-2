<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Ticket;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketMessage>
 */
class TicketMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ticket = Ticket::inRandomOrder()->first() ?? Ticket::factory()->create();
        $user = User::inRandomOrder()->first() ?? User::factory()->create();

        return [
            'ticket_id' => $ticket->id,
            'sender_id' => $user->id,
            'mensagem' => $this->faker->paragraph(),
            'visivel_para_cliente' => $this->faker->boolean(80), // 80% chance of being visible to client
        ];
    }
}