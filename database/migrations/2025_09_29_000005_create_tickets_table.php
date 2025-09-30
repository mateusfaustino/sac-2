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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('numero_contrato');
            $table->string('numero_nf');
            $table->string('numero_serie')->nullable();
            $table->text('descricao')->nullable();
            $table->enum('status', [
                'aberto', 
                'em_analise', 
                'aprovado', 
                'reprovado', 
                'aguardando_envio', 
                'em_transito', 
                'recebido', 
                'concluido', 
                'cancelado'
            ])->default('aberto');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['client_id', 'status', 'created_at']);
            $table->index('numero_nf');
            $table->index('numero_serie');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};