<?php
require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Configure database connection
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
    'port' => $_ENV['DB_PORT'] ?? '3306',
    'database' => $_ENV['DB_DATABASE'] ?? 'sac',
    'username' => $_ENV['DB_USERNAME'] ?? 'sac',
    'password' => $_ENV['DB_PASSWORD'] ?? 'sac',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "Connected to database successfully.\n";

// Check if clients table exists
try {
    $clientsExist = Capsule::schema()->hasTable('clients');
    echo "Clients table exists: " . ($clientsExist ? 'Yes' : 'No') . "\n";
    
    if ($clientsExist) {
        $clientCount = Capsule::table('clients')->count();
        echo "Number of clients: $clientCount\n";
        
        if ($clientCount > 0) {
            // Get the first client
            $firstClient = Capsule::table('clients')->first();
            echo "Using first client (ID: {$firstClient->id}) for associating users.\n";
            
            // Find users with null client_id
            $usersWithNullClientId = Capsule::table('users')
                ->whereNull('client_id')
                ->where('role', 'client')
                ->get();
                
            echo "Found " . count($usersWithNullClientId) . " users with null client_id.\n";
            
            // Update these users to associate them with the first client
            foreach ($usersWithNullClientId as $user) {
                Capsule::table('users')
                    ->where('id', $user->id)
                    ->update(['client_id' => $firstClient->id]);
                    
                echo "Updated user {$user->id} ({$user->email}) with client_id {$firstClient->id}\n";
            }
            
            echo "Fixed all users with null client_id.\n";
        } else {
            echo "No clients found in database.\n";
        }
    } else {
        echo "Clients table does not exist.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}