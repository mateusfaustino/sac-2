<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Models\TicketStatusHistory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketStatusUpdatedNotification extends Notification
{
    use Queueable;

    protected $ticket;
    protected $statusHistory;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket, TicketStatusHistory $statusHistory)
    {
        $this->ticket = $ticket;
        $this->statusHistory = $statusHistory;
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
        $message = (new MailMessage)
                    ->subject('Return Request Status Updated - ' . $this->ticket->ticket_number)
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('The status of your return request has been updated.')
                    ->line('Ticket Number: ' . $this->ticket->ticket_number)
                    ->line('New Status: ' . ucfirst(str_replace('_', ' ', $this->statusHistory->status_to)));

        if ($this->statusHistory->motivo) {
            $message->line('Reason: ' . $this->statusHistory->motivo);
        }

        return $message->action('View Ticket', url('/client/tickets/' . $this->ticket->id))
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
            'status_from' => $this->statusHistory->status_from,
            'status_to' => $this->statusHistory->status_to,
            'message' => 'The status of your return request has been updated.',
        ];
    }
}