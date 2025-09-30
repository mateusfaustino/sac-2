<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ticket_number',
        'client_id',
        'user_id',
        'numero_contrato',
        'numero_nf',
        'numero_serie',
        'descricao',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the client that owns the ticket.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the user that created the ticket.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the ticket.
     */
    public function items()
    {
        return $this->hasMany(TicketItem::class);
    }

    /**
     * Get the status history for the ticket.
     */
    public function statusHistory()
    {
        return $this->hasMany(TicketStatusHistory::class);
    }

    /**
     * Get the messages for the ticket.
     */
    public function messages()
    {
        return $this->hasMany(TicketMessage::class);
    }

    /**
     * Get the attachments for the ticket.
     */
    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}