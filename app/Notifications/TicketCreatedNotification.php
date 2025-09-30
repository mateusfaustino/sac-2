<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketCreatedNotification extends Notification
{
    use Queueable;

    protected $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('New Return Request Created - ' . $this->ticket->ticket_number)
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('A new return request has been created with the following details:')
                    ->line('Ticket Number: ' . $this->ticket->ticket_number)
                    ->line('Contract Number: ' . $this->ticket->numero_contrato)
                    ->line('Status: ' . ucfirst(str_replace('_', ' ', $this->ticket->status)))
                    ->action('View Ticket', url('/client/tickets/' . $this->ticket->id))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'message' => 'A new return request has been created.',
        ];
    }
}