<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use App\Models\Client;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTicketManagementTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that admin can view the tickets index page.
     *
     * @return void
     */
    public function test_admin_can_view_tickets_index_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin'
        ]);

        $response = $this->actingAs($admin)->get(route('admin.tickets.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Tickets/Index')
        );
    }

    /**
     * Test that admin can update ticket status.
     *
     * @return void
     */
    public function test_admin_can_update_ticket_status(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin'
        ]);

        $client = Client::factory()->create();
        $product = Product::factory()->create(['ativo' => true]);
        
        $ticket = Ticket::factory()->create([
            'client_id' => $client->id,
            'user_id' => User::factory()->create(['client_id' => $client->id])->id,
            'status' => 'aberto'
        ]);

        $response = $this->actingAs($admin)->put(route('admin.tickets.update', $ticket), [
            'status' => 'em_analise',
            'observacao' => 'Ticket em análise'
        ]);

        $response->assertRedirect(); // Redirects back to the previous page
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'em_analise'
        ]);
    }

    /**
     * Test that client cannot access admin routes.
     *
     * @return void
     */
    public function test_client_cannot_access_admin_routes(): void
    {
        $clientUser = User::factory()->create([
            'role' => 'client'
        ]);

        $response = $this->actingAs($clientUser)->get(route('admin.tickets.index'));

        $response->assertStatus(302); // Redirected due to middleware
    }
}