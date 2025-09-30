<?php

namespace Tests\Unit;

use App\Models\Client;
use App\Models\Product;
use App\Models\User;
use App\Services\TicketService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $ticketService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->ticketService = new TicketService();
    }

    /** @test */
    public function it_can_create_a_ticket()
    {
        // Create a client and user
        $client = Client::factory()->create();
        $user = User::factory()->create([
            'client_id' => $client->id,
            'role' => 'client'
        ]);
        
        // Create a product
        $product = Product::factory()->create();
        
        // Authenticate as the client user
        $this->actingAs($user);
        
        // Create ticket data
        $data = [
            'product_id' => $product->id,
            'quantidade' => 5,
            'numero_contrato' => 'CTR-001',
            'numero_nf' => 'NF123456',
            'numero_serie' => 'SER-789',
            'descricao' => 'Product is defective',
        ];
        
        // Create the ticket
        $ticket = $this->ticketService->createTicket($data);
        
        // Assertions
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'client_id' => $client->id,
            'numero_contrato' => 'CTR-001',
            'status' => 'aberto'
        ]);
        
        $this->assertDatabaseHas('ticket_items', [
            'ticket_id' => $ticket->id,
            'product_id' => $product->id,
            'quantidade' => 5
        ]);
        
        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'status_to' => 'aberto',
            'motivo' => 'Ticket created'
        ]);
    }

    /** @test */
    public function it_can_update_ticket_status()
    {
        // Create a client, user, and product
        $client = Client::factory()->create();
        $user = User::factory()->create([
            'client_id' => $client->id,
            'role' => 'client'
        ]);
        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::factory()->create();
        
        // Authenticate as the client user and create a ticket
        $this->actingAs($user);
        
        $data = [
            'product_id' => $product->id,
            'quantidade' => 3,
            'numero_contrato' => 'CTR-002',
            'numero_nf' => 'NF789012',
        ];
        
        $ticket = $this->ticketService->createTicket($data);
        
        // Authenticate as admin and update status
        $this->actingAs($admin);
        
        $updatedTicket = $this->ticketService->updateTicketStatus(
            $ticket, 
            'em_analise', 
            'Checking the return request'
        );
        
        // Assertions
        $this->assertEquals('em_analise', $updatedTicket->status);
        
        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'status_from' => 'aberto',
            'status_to' => 'em_analise',
            'motivo' => 'Checking the return request'
        ]);
    }
}