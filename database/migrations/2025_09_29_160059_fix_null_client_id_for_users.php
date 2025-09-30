<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get the first client ID, or create a default client if none exist
        $firstClientId = DB::table('clients')->orderBy('id')->first()?->id;
        
        if (!$firstClientId) {
            // Create a default client if none exist
            $firstClientId = DB::table('clients')->insertGetId([
                'cnpj' => '00000000000000',
                'razao_social' => 'Default Client',
                'email_notificacao' => 'default@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Update users with null client_id to associate them with the first client
        DB::table('users')
            ->whereNull('client_id')
            ->where('role', 'client')
            ->update(['client_id' => $firstClientId]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We don't reverse this migration as it would break the data integrity
    }
};