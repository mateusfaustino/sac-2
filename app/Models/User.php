<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'client_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the user is a client.
     *
     * @return bool
     */
    public function isClient()
    {
        return $this->role === 'client';
    }

    /**
     * Get the client associated with the user.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the tickets created by the user.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Get the ticket status histories changed by the user.
     */
    public function statusHistories()
    {
        return $this->hasMany(TicketStatusHistory::class, 'changed_by');
    }

    /**
     * Get the ticket messages sent by the user.
     */
    public function messages()
    {
        return $this->hasMany(TicketMessage::class, 'sender_id');
    }

    /**
     * Get the attachments uploaded by the user.
     */
    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'uploaded_by');
    }
}