<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Ticket;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attachment>
 */
class AttachmentFactory extends Factory
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
            'uploaded_by' => $user->id,
            'path' => 'attachments/' . $this->faker->uuid() . '.pdf',
            'nome_original' => $this->faker->word() . '.pdf',
            'mime_type' => 'application/pdf',
            'size' => $this->faker->numberBetween(1024, 1024000), // 1KB to 1MB
        ];
    }
}