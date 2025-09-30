<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketCreationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function client_can_create_a_ticket()
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
        
        // Submit ticket creation form
        $response = $this->post(route('client.tickets.store'), [
            'product_id' => $product->id,
            'quantidade' => 5,
            'numero_contrato' => 'CTR-001',
            'numero_nf' => 'NF123456',
            'numero_serie' => 'SER-789',
            'descricao' => 'Product is defective',
        ]);
        
        // Assertions
        $response->assertRedirect(route('client.tickets.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('tickets', [
            'client_id' => $client->id,
            'numero_contrato' => 'CTR-001',
            'status' => 'aberto'
        ]);
        
        $this->assertDatabaseHas('ticket_items', [
            'product_id' => $product->id,
            'quantidade' => 5
        ]);
    }

    /** @test */
    public function admin_cannot_create_ticket()
    {
        // Create an admin user
        $admin = User::factory()->create(['role' => 'admin']);
        
        // Authenticate as admin
        $this->actingAs($admin);
        
        // Try to access ticket creation page
        $response = $this->get(route('client.tickets.create'));
        
        // Should be redirected to login (not authorized)
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function client_can_view_their_own_tickets()
    {
        // Create clients and users
        $client1 = Client::factory()->create();
        $user1 = User::factory()->create([
            'client_id' => $client1->id,
            'role' => 'client'
        ]);
        
        $client2 = Client::factory()->create();
        $user2 = User::factory()->create([
            'client_id' => $client2->id,
            'role' => 'client'
        ]);
        
        // Create tickets for both clients
        $ticket1 = \App\Models\Ticket::factory()->create([
            'client_id' => $client1->id,
            'user_id' => $user1->id,
            'ticket_number' => 'TCK-001'
        ]);
        
        $ticket2 = \App\Models\Ticket::factory()->create([
            'client_id' => $client2->id,
            'user_id' => $user2->id,
            'ticket_number' => 'TCK-002'
        ]);
        
        // Authenticate as first client
        $this->actingAs($user1);
        
        // View ticket index
        $response = $this->get(route('client.tickets.index'));
        
        // Should see only their own ticket
        $response->assertSee('TCK-001');
        $response->assertDontSee('TCK-002');
    }
}