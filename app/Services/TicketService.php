<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketItem;
use App\Models\TicketStatusHistory;
use App\Notifications\TicketCreatedNotification;
use App\Notifications\TicketStatusUpdatedNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TicketService
{
    /**
     * Create a new ticket with its items.
     *
     * @param array $data
     * @return Ticket
     */
    public function createTicket(array $data): Ticket
    {
        // Check if the authenticated user has a client_id
        if (Auth::user()->role === 'client' && Auth::user()->client_id === null) {
            Log::error('Client user attempting to create ticket without client_id', [
                'user_id' => Auth::id(),
                'user_email' => Auth::user()->email
            ]);
            throw new \Exception('User is not properly associated with a client. Please contact support.');
        }

        return DB::transaction(function () use ($data) {
            // Generate unique ticket number
            $ticketNumber = 'TCK-' . strtoupper(uniqid());

            $ticket = Ticket::create([
                'ticket_number' => $ticketNumber,
                'client_id' => Auth::user()->client_id,
                'user_id' => Auth::id(),
                'numero_contrato' => $data['numero_contrato'],
                'numero_nf' => $data['numero_nf'],
                'numero_serie' => $data['numero_serie'] ?? null,
                'descricao' => $data['descricao'] ?? null,
                'status' => 'aberto',
            ]);

            // Create ticket item
            TicketItem::create([
                'ticket_id' => $ticket->id,
                'product_id' => $data['product_id'],
                'quantidade' => $data['quantidade'],
                'numero_nf' => $data['numero_nf'],
                'numero_serie' => $data['numero_serie'] ?? null,
            ]);

            // Create initial status history
            $statusHistory = TicketStatusHistory::create([
                'ticket_id' => $ticket->id,
                'status_from' => null,
                'status_to' => 'aberto',
                'changed_by' => Auth::id(),
                'motivo' => 'Ticket created',
            ]);

            // Send notification to the client
            $ticket->user->notify(new TicketCreatedNotification($ticket));

            return $ticket;
        });
    }

    /**
     * Update ticket status.
     *
     * @param Ticket $ticket
     * @param string $newStatus
     * @param string|null $observation
     * @return Ticket
     */
    public function updateTicketStatus(Ticket $ticket, string $newStatus, ?string $observation = null): Ticket
    {
        return DB::transaction(function () use ($ticket, $newStatus, $observation) {
            $oldStatus = $ticket->status;
            $ticket->status = $newStatus;
            $ticket->save();

            // Create status history
            $statusHistory = TicketStatusHistory::create([
                'ticket_id' => $ticket->id,
                'status_from' => $oldStatus,
                'status_to' => $newStatus,
                'changed_by' => Auth::id(),
                'motivo' => $observation,
            ]);

            // Send notification to the client if the status has changed
            if ($oldStatus !== $newStatus) {
                $ticket->user->notify(new TicketStatusUpdatedNotification($ticket, $statusHistory));
            }

            return $ticket;
        });
    }

    /**
     * Get ticket statistics for admin dashboard.
     *
     * @return array
     */
    public function getTicketStats(): array
    {
        return [
            'total_tickets' => Ticket::count(),
            'open_tickets' => Ticket::where('status', 'aberto')->count(),
            'in_analysis_tickets' => Ticket::where('status', 'em_analise')->count(),
            'approved_tickets' => Ticket::where('status', 'aprovado')->count(),
        ];
    }
}