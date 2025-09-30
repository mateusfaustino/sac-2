<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminUserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Client dashboard - requires client authentication
Route::middleware(['auth', 'redirect-if-not-client'])->group(function () {
    Route::get('/client/dashboard', function () {
        return Inertia::render('Client/Dashboard');
    })->name('client.dashboard');

    Route::get('/client/tickets', [TicketController::class, 'index'])->name('client.tickets.index');
    Route::get('/client/tickets/create', [TicketController::class, 'create'])->name('client.tickets.create');
    Route::post('/client/tickets', [TicketController::class, 'store'])->name('client.tickets.store');
    Route::get('/client/tickets/{ticket}', [TicketController::class, 'show'])->name('client.tickets.show');
});

// Admin dashboard - requires admin authentication
Route::middleware(['auth', 'redirect-if-not-admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        // Get ticket statistics
        $stats = [
            'total_tickets' => \App\Models\Ticket::count(),
            'open_tickets' => \App\Models\Ticket::where('status', 'aberto')->count(),
            'in_analysis_tickets' => \App\Models\Ticket::where('status', 'em_analise')->count(),
            'approved_tickets' => \App\Models\Ticket::where('status', 'aprovado')->count(),
        ];
        
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
        
    })->name('admin.dashboard');

    // Admin tickets routes
    Route::get('/admin/tickets', [TicketController::class, 'index'])->name('admin.tickets.index');
    Route::get('/admin/tickets/export/{format}', [TicketController::class, 'export'])->name('admin.tickets.export');
    Route::get('/admin/tickets/{ticket}', [TicketController::class, 'show'])->name('admin.tickets.show');
    Route::get('/admin/tickets/{ticket}/edit', [TicketController::class, 'edit'])->name('admin.tickets.edit');
    Route::put('/admin/tickets/{ticket}', [TicketController::class, 'update'])->name('admin.tickets.update');
    Route::delete('/admin/tickets/{ticket}', [TicketController::class, 'destroy'])->name('admin.tickets.destroy');
    
    // Admin clients routes
    Route::get('/admin/clients', [ClientController::class, 'index'])->name('admin.clients.index');
    Route::get('/admin/clients/{client}', [ClientController::class, 'show'])->name('admin.clients.show');
    Route::get('/admin/clients/export/{format}', [ClientController::class, 'export'])->name('admin.clients.export');
    
    // Admin products routes
    Route::get('/admin/products', [ProductController::class, 'index'])->name('admin.products.index');
    Route::get('/admin/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/admin/products/{product}', [ProductController::class, 'show'])->name('admin.products.show');
    Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::post('/admin/products/{id}/restore', [ProductController::class, 'restore'])->name('admin.products.restore');
    Route::get('/admin/products/export/{format}', [ProductController::class, 'export'])->name('admin.products.export');
    
    // Admin users routes
    Route::get('/admin/admin-users', [AdminUserController::class, 'index'])->name('admin.admin-users.index');
    Route::get('/admin/admin-users/create', [AdminUserController::class, 'create'])->name('admin.admin-users.create');
    Route::post('/admin/admin-users', [AdminUserController::class, 'store'])->name('admin.admin-users.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';