<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cnpj',
        'razao_social',
        'email_notificacao',
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
     * Get the users for the client.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the tickets for the client.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}