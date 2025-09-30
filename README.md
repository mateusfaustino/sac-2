# Returns Portal (SAC) System

A Laravel-based system for managing product return requests (tickets) made by clients authenticated by CNPJ.

## Features

- Client authentication via CNPJ and password
- Ticket creation and management for clients
- Admin dashboard for managing all tickets
- Status tracking and history
- Email notifications
- Comprehensive audit trail

## Requirements

- PHP 8.2+
- Composer
- Node.js and NPM
- SQLite (for development) or MySQL (for production)
- Laravel 11+

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd sac-2

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Copy and configure the environment file
cp .env.example .env
php artisan key:generate

# Run database migrations and seeders
php artisan migrate --seed

# Compile frontend assets
npm run dev
```

## Running the Application

```bash
# Start the development server
php artisan serve

# Run tests
php artisan test
```

## Documentation

For detailed documentation, see [DOCUMENTATION.md](DOCUMENTATION.md).

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).