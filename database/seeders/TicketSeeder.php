<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\TicketItem;
use App\Models\TicketStatusHistory;
use App\Models\TicketMessage;
use App\Models\Attachment;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample tickets
        Ticket::factory()->count(50)->create()->each(function ($ticket) {
            // Create ticket items
            TicketItem::factory()->count(rand(1, 3))->create(['ticket_id' => $ticket->id]);
            
            // Create status history
            TicketStatusHistory::factory()->count(rand(1, 5))->create(['ticket_id' => $ticket->id]);
            
            // Create messages
            TicketMessage::factory()->count(rand(0, 3))->create(['ticket_id' => $ticket->id]);
            
            // Create attachments
            Attachment::factory()->count(rand(0, 2))->create(['ticket_id' => $ticket->id]);
        });
    }
}