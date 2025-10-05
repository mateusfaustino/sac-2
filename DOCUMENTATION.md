# Returns Portal (SAC) System Documentation

## Overview

This is a Laravel-based system for managing product return requests (tickets) made by clients authenticated by CNPJ. The system includes:

- Client authentication via CNPJ and password
- Ticket creation and management for clients
- Admin dashboard for managing all tickets
- Status tracking and history
- Notifications and audit trails

## System Requirements

- PHP 8.2 or higher
- Composer
- Node.js and NPM
- SQLite (for development) or MySQL (for production)
- Laravel 11+

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sac-2
   ```

2. Install PHP dependencies:
   ```
   composer install
   ```

3. Install JavaScript dependencies:
   ```
   npm install
   ```

4. Copy and configure the environment file:
   ```
   cp .env.example .env
   php artisan key:generate
   ```

5. Run database migrations and seeders:
   ```
   php artisan migrate --seed
   ```

6. Compile frontend assets:
   ```
   npm run dev
   ```

## Running the Application

### Development Server

Start the Laravel development server:
```
php artisan serve
```

The application will be available at `http://localhost:8000`.

### Running Tests

To run all tests:
```
php artisan test
```

To run specific test suites:
```
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
```

## Database Structure

The system uses the following main tables:

- `clients` - Stores client information (CNPJ, company name, notification email)
- `users` - Stores user accounts (both clients and admins)
- `products` - Product catalog
- `tickets` - Main ticket information
- `ticket_items` - Items in each ticket
- `ticket_status_histories` - Status change history
- `ticket_messages` - Messages between clients and admins
- `attachments` - File attachments to tickets

## Authentication

### Client Authentication

Clients authenticate using their CNPJ and password. The system validates the CNPJ format and checks against registered clients.

Routes:
- `GET /client/login` - Client login form
- `POST /client/login` - Process client login

### Admin Authentication

Admins authenticate using email and password through the standard Laravel authentication.

Routes:
- `GET /login` - Admin login form
- `POST /login` - Process admin login

## Core Functionality

### Client Dashboard

Accessible at `/client/dashboard` after client authentication.

Features:
- Create new tickets
- View existing tickets
- Access account settings

### Ticket Management

#### For Clients

- Create tickets with product, quantity, contract number, invoice number, and serial number
- View ticket status and history
- Add messages to tickets

#### For Admins

- View all tickets across all clients
- Filter and search tickets
- Update ticket status
- Add internal notes and observations
- Communicate with clients through messages
- Attach files to tickets

### Status Flow

Tickets follow this status flow:
1. `aberto` (Open) - Created by client
2. `em_analise` (In Analysis) - Admin reviewing
3. `aprovado` (Approved) or `reprovado` (Rejected)
4. If approved:
   - `aguardando_envio` (Awaiting Shipment)
   - `em_transito` (In Transit)
   - `recebido` (Received)
   - `concluido` (Completed)
5. `cancelado` (Canceled) - Can be applied at any stage

## Notifications

The system sends email notifications to clients when:
- A new ticket is created
- The status of a ticket is updated

Notifications are sent using Laravel's notification system and can be easily extended to support other channels like SMS or push notifications.

## Audit Trail

All actions in the system are logged for audit purposes:
- Ticket creation
- Status changes
- Messages
- Attachments

Each audit entry includes:
- Timestamp
- User who performed the action
- Details of what changed

## API Endpoints

All routes are protected by authentication middleware.

### Ticket Routes

Client routes (require client authentication):
- `GET /client/tickets` - List client's tickets
- `GET /client/tickets/create` - Show ticket creation form
- `POST /client/tickets` - Create new ticket
- `GET /client/tickets/{ticket}` - View ticket details

Admin routes (require admin authentication):
- `GET /admin/tickets` - List all tickets
- `GET /admin/tickets/{ticket}` - View ticket details
- `GET /admin/tickets/{ticket}/edit` - Show ticket edit form
- `PUT /admin/tickets/{ticket}` - Update ticket
- `DELETE /admin/tickets/{ticket}` - Delete ticket

## Testing

The system includes comprehensive tests:

- Unit tests for services and business logic
- Feature tests for user interactions
- Authentication tests
- Authorization tests

Run tests with:
```
php artisan test
```

## Development

### Adding New Features

1. Create new migrations for database changes:
   ```
   php artisan make:migration <description>
   ```

2. Create models if needed:
   ```
   php artisan make:model <ModelName>
   ```

3. Create controllers:
   ```
   php artisan make:controller <ControllerName>
   ```

4. Create requests for validation:
   ```
   php artisan make:request <RequestName>
   ```

5. Create tests:
   ```
   php artisan make:test <TestName>
   ```

### Code Structure

- `app/Models` - Eloquent models
- `app/Http/Controllers` - Controllers
- `app/Http/Requests` - Form request validation
- `app/Services` - Business logic services
- `app/Providers` - Service providers
- `app/Notifications` - Notification classes
- `database/migrations` - Database migrations
- `database/factories` - Model factories
- `database/seeders` - Database seeders
- `resources/js/Pages` - React components
- `routes` - Route definitions
- `tests` - Test files

## CI/CD Deployment

The system includes a complete CI/CD pipeline with automated testing, building, and deployment.

### Components

1. **Docker Images**: Built and stored in GitHub Container Registry (GHCR)
2. **GitHub Actions**: Automated pipeline for testing and deployment
3. **Production Deployment**: Zero-downtime deployment with rollback capabilities
4. **Health Checks**: Automated service health verification

### Deployment Process

1. **Build**: Docker images are built on every push
2. **Test**: Automated tests run in isolated containers
3. **Push**: Images are pushed to GHCR with version tags
4. **Deploy**: Production deployment via SSH with health checks
5. **Rollback**: Automatic rollback on deployment failure

See [DEPLOYMENT-README.md](DEPLOYMENT-README.md) for detailed deployment instructions.

## Deployment

For production deployment:

1. Set up a web server (Apache/Nginx)
2. Configure database connection in `.env`
3. Run migrations:
   ```
   php artisan migrate --force
   ```
4. Optimize the application:
   ```
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
5. Compile and minify frontend assets:
   ```
   npm run build
   ```

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check `.env` database configuration
2. **Migration errors**: Ensure database exists and credentials are correct
3. **Authentication issues**: Verify user roles and client associations
4. **Permission errors**: Check file permissions for storage and bootstrap/cache directories

### Support

For issues with the system, contact the development team or check the Laravel documentation for framework-specific issues.