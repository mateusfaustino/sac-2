<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Ticket;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketStatusHistory>
 */
class TicketStatusHistoryFactory extends Factory
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
        
        $statuses = ['aberto', 'em_analise', 'aprovado', 'reprovado', 'aguardando_envio', 'em_transito', 'recebido', 'concluido', 'cancelado'];
        $fromStatus = $this->faker->randomElement($statuses);
        $toStatus = $this->faker->randomElement(array_filter($statuses, function($status) use ($fromStatus) {
            return $status !== $fromStatus;
        }));

        return [
            'ticket_id' => $ticket->id,
            'status_from' => $fromStatus,
            'status_to' => $toStatus,
            'changed_by' => $user->id,
            'motivo' => $this->faker->optional()->sentence(),
        ];
    }
}