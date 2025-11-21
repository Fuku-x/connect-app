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
        Schema::table('users', function (Blueprint $table) {
            $table->string('student_id', 50)->nullable()->after('email');
            $table->string('department', 255)->nullable()->after('student_id');
            $table->tinyInteger('grade')->unsigned()->nullable()->after('department');
            $table->text('bio')->nullable()->after('grade');
            $table->string('profile_image', 255)->nullable()->after('bio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'student_id',
                'department',
                'grade',
                'bio',
                'profile_image'
            ]);
        });
    }
};
