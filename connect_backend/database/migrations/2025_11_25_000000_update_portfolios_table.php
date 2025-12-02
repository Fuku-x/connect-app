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
        Schema::table('portfolios', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->after('links');
            $table->string('thumbnail_path')->nullable()->after('is_public');
            $table->json('gallery_images')->nullable()->after('thumbnail_path');
            $table->string('github_url')->nullable()->after('gallery_images');
            $table->string('external_url')->nullable()->after('github_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropColumn([
                'is_public',
                'thumbnail_path',
                'gallery_images',
                'github_url',
                'external_url',
            ]);
        });
    }
};
