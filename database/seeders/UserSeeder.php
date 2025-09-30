<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an admin user
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create client users
        $clients = Client::all();
        foreach ($clients as $client) {
            User::factory()->client()->create([
                'client_id' => $client->id,
                'name' => $client->razao_social . ' User',
                'email' => 'user@' . str_replace(' ', '', strtolower($client->razao_social)) . '.com',
                'password' => bcrypt('password'),
            ]);
        }
    }
}