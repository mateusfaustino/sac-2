<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ticket_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->string('status_from')->nullable();
            $table->string('status_to');
            $table->foreignId('changed_by')->constrained('users')->onDelete('cascade');
            $table->text('motivo')->nullable(); // Reason/observation for the status change
            $table->timestamps();
            
            // Indexes for performance
            $table->index('ticket_id');
            $table->index('changed_by');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_status_histories');
    }
};