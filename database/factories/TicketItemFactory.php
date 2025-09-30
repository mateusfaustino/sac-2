<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Ticket;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketItem>
 */
class TicketItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_id' => Ticket::factory(),
            'product_id' => Product::factory(),
            'quantidade' => $this->faker->numberBetween(1, 100),
            'numero_nf' => $this->faker->optional()->numerify('NF#########'),
            'numero_serie' => $this->faker->optional()->bothify('SER-########'),
        ];
    }
}