<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the admin users.
     */
    public function index(Request $request)
    {
        // Only admins can view admin users
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        $query = User::where('role', 'admin');
        
        // Apply filters
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }
        
        $adminUsers = $query->latest()->paginate(10)->withQueryString();
        
        // Pass filters to the view
        $filters = $request->only(['name', 'email']);
        
        return Inertia::render('Admin/AdminUsers/Index', [
            'adminUsers' => $adminUsers,
            'filters' => $filters,
        ]);
    }
    
    /**
     * Show the form for creating a new admin user.
     */
    public function create()
    {
        // Only admins can create admin users
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        return Inertia::render('Admin/AdminUsers/Create');
    }
    
    /**
     * Store a newly created admin user in storage.
     */
    public function store(Request $request)
    {
        // Only admins can create admin users
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Create the admin user
        $adminUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);
        
        return redirect()->route('admin.admin-users.index')->with('success', 'Usuário administrador criado com sucesso.');
    }
}