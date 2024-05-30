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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['pending', 'completed', 'in_progress'])->default('pending');
            $table->enum('priority', ['low', 'medium', 'high', 'note'])->default('medium');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('requester_id');
            $table->string('abstract', 400);
            $table->text('description')->nullable();


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
