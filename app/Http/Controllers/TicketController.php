<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use App\Models\Product;
use App\Models\Client;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Dompdf\Dompdf;
use Dompdf\Options;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Ticket::with(['client', 'items.product']);
        
        // Apply client filter for non-admin users
        if (Auth::user()->role === 'client') {
            $query->where('client_id', Auth::user()->client_id);
        }
        
        // Apply default filter for admin users (open and in analysis tickets)
        if (Auth::user()->role === 'admin') {
            // If no status filter is applied, show only open and in analysis tickets by default
            if (!$request->has('status') || empty($request->status)) {
                $query->whereIn('status', ['aberto', 'em_analise']);
            }
        }
        
        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('client')) {
            $query->whereHas('client', function ($q) use ($request) {
                $q->where('razao_social', 'like', '%' . $request->client . '%');
            });
        }
        
        if ($request->filled('product')) {
            $query->whereHas('items.product', function ($q) use ($request) {
                $q->where('descricao', 'like', '%' . $request->product . '%');
            });
        }
        
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', '%' . $search . '%')
                  ->orWhereHas('client', function ($cq) use ($search) {
                      $cq->where('cnpj', 'like', '%' . $search . '%')
                        ->orWhere('razao_social', 'like', '%' . $search . '%');
                  });
            });
        }
        
        $tickets = $query->latest()->paginate(10)->withQueryString();
        
        // Pass filters to the view
        $filters = $request->only(['status', 'client', 'product', 'date_from', 'date_to', 'search']);
        
        if (Auth::user()->role === 'admin') {
            return Inertia::render('Admin/Tickets/Index', [
                'tickets' => $tickets,
                'filters' => $filters,
            ]);
        }

        return Inertia::render('Client/Tickets/Index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only clients can create tickets
        if (Auth::user()->role !== 'client') {
            return redirect()->route('client.dashboard');
        }

        // Check if the user has a client_id
        if (Auth::user()->client_id === null) {
            return redirect()->route('client.dashboard')
                ->with('error', 'Sua conta não está corretamente associada a um cliente. Por favor, entre em contato com o suporte.');
        }

        $products = Product::where('ativo', true)->get();

        return Inertia::render('Client/Tickets/Create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        // Only clients can create tickets
        if (Auth::user()->role !== 'client') {
            return redirect()->route('client.dashboard');
        }

        // Check if the user has a client_id
        if (Auth::user()->client_id === null) {
            return redirect()->route('client.dashboard')
                ->with('error', 'Sua conta não está corretamente associada a um cliente. Por favor, entre em contato com o suporte.');
        }

        try {
            $ticket = $this->ticketService->createTicket($request->all(), Auth::user());
            return redirect()->route('client.tickets.show', $ticket->id)
                ->with('success', 'Ticket criado com sucesso!');
        } catch (\Exception $e) {
            Log::error('Error creating ticket: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Ocorreu um erro ao criar o ticket. Por favor, tente novamente.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        // Check authorization
        if (Auth::user()->role === 'client' && $ticket->client_id !== Auth::user()->client_id) {
            return redirect()->route('client.dashboard');
        }

        $ticket->load(['client', 'items.product', 'statusHistory.user', 'messages.user']);

        if (Auth::user()->role === 'admin') {
            return Inertia::render('Admin/Tickets/Show', [
                'ticket' => $ticket,
            ]);
        }

        return Inertia::render('Client/Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        // Only admins can edit tickets
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }

        $ticket->load(['client', 'items.product']);
        $products = Product::where('ativo', true)->get();

        return Inertia::render('Admin/Tickets/Edit', [
            'ticket' => $ticket,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        // Only admins can update tickets
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }

        try {
            $this->ticketService->updateTicket($ticket, $request->all());
            return redirect()->route('admin.tickets.show', $ticket->id)
                ->with('success', 'Ticket atualizado com sucesso!');
        } catch (\Exception $e) {
            Log::error('Error updating ticket: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Ocorreu um erro ao atualizar o ticket. Por favor, tente novamente.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        // Only admins can delete tickets
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }

        try {
            $this->ticketService->deleteTicket($ticket);
            return redirect()->route('admin.tickets.index')
                ->with('success', 'Ticket excluído com sucesso!');
        } catch (\Exception $e) {
            Log::error('Error deleting ticket: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Ocorreu um erro ao excluir o ticket. Por favor, tente novamente.');
        }
    }

    /**
     * Export tickets to Excel or PDF
     */
    public function export(Request $request, $format)
    {
        // Only admins can export tickets
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.tickets.index');
        }
        
        $query = Ticket::with(['client', 'items.product']);
        
        // Apply default filter (open and in analysis tickets)
        if (!$request->has('status') || empty($request->status)) {
            $query->whereIn('status', ['aberto', 'em_analise']);
        }
        
        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('client')) {
            $query->whereHas('client', function ($q) use ($request) {
                $q->where('razao_social', 'like', '%' . $request->client . '%');
            });
        }
        
        if ($request->filled('product')) {
            $query->whereHas('items.product', function ($q) use ($request) {
                $q->where('descricao', 'like', '%' . $request->product . '%');
            });
        }
        
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', '%' . $search . '%')
                  ->orWhereHas('client', function ($cq) use ($search) {
                      $cq->where('cnpj', 'like', '%' . $search . '%')
                        ->orWhere('razao_social', 'like', '%' . $search . '%');
                  });
            });
        }
        
        $tickets = $query->latest()->get();
        
        if ($format === 'excel') {
            return $this->exportToExcel($tickets);
        } elseif ($format === 'pdf') {
            return $this->exportToPDF($tickets);
        }
        
        return redirect()->back()->with('error', 'Formato de exportação inválido.');
    }
    
    /**
     * Export tickets to Excel
     */
    private function exportToExcel($tickets)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Set headers
        $sheet->setCellValue('A1', 'Número do Ticket');
        $sheet->setCellValue('B1', 'Cliente');
        $sheet->setCellValue('C1', 'Produto(s)');
        $sheet->setCellValue('D1', 'Status');
        $sheet->setCellValue('E1', 'Data de Criação');
        $sheet->setCellValue('F1', 'Contrato');
        $sheet->setCellValue('G1', 'Nota Fiscal');
        
        // Set data
        $row = 2;
        foreach ($tickets as $ticket) {
            $products = $ticket->items->map(function ($item) {
                return $item->product ? $item->product->descricao : 'N/A';
            })->implode(', ');
            
            $statusMap = [
                'aberto' => 'Aberto',
                'em_analise' => 'Em Análise',
                'aprovado' => 'Aprovado',
                'reprovado' => 'Reprovado',
                'aguardando_envio' => 'Aguardando Envio',
                'em_transito' => 'Em Trânsito',
                'recebido' => 'Recebido',
                'concluido' => 'Concluído'
            ];
            
            $sheet->setCellValue('A' . $row, $ticket->ticket_number);
            $sheet->setCellValue('B' . $row, $ticket->client->razao_social ?? 'N/A');
            $sheet->setCellValue('C' . $row, $products);
            $sheet->setCellValue('D' . $row, $statusMap[$ticket->status] ?? $ticket->status);
            $sheet->setCellValue('E' . $row, $ticket->created_at->format('d/m/Y H:i:s'));
            $sheet->setCellValue('F' . $row, $ticket->numero_contrato);
            $sheet->setCellValue('G' . $row, $ticket->numero_nf);
            
            $row++;
        }
        
        // Auto-size columns
        foreach (range('A', 'G') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        
        // Set headers to bold
        $sheet->getStyle('A1:G1')->getFont()->setBold(true);
        
        // Create Excel file
        $writer = new Xlsx($spreadsheet);
        $fileName = 'tickets_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        // Write to memory
        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();
        
        // Return response with proper headers for download
        return response()->make($content, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Cache-Control' => 'max-age=0'
        ]);
    }
    
    /**
     * Export tickets to PDF
     */
    private function exportToPDF($tickets)
    {
        $html = '
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                h1 { text-align: center; }
                .status-aberto { background-color: #fef3c7; color: #92400e; }
                .status-em_analise { background-color: #dbeafe; color: #1e40af; }
                .status-aprovado { background-color: #d1fae5; color: #065f46; }
                .status-reprovado { background-color: #fee2e2; color: #991b1b; }
                .status-default { background-color: #f3f4f6; color: #374151; }
            </style>
        </head>
        <body>
            <h1>Relatório de Tickets</h1>
            <table>
                <thead>
                    <tr>
                        <th>Número do Ticket</th>
                        <th>Cliente</th>
                        <th>Produto(s)</th>
                        <th>Status</th>
                        <th>Data de Criação</th>
                        <th>Contrato</th>
                        <th>Nota Fiscal</th>
                    </tr>
                </thead>
                <tbody>';
        
        $statusMap = [
            'aberto' => 'Aberto',
            'em_analise' => 'Em Análise',
            'aprovado' => 'Aprovado',
            'reprovado' => 'Reprovado',
            'aguardando_envio' => 'Aguardando Envio',
            'em_transito' => 'Em Trânsito',
            'recebido' => 'Recebido',
            'concluido' => 'Concluído'
        ];
        
        $statusClasses = [
            'aberto' => 'status-aberto',
            'em_analise' => 'status-em_analise',
            'aprovado' => 'status-aprovado',
            'reprovado' => 'status-reprovado',
        ];
        
        foreach ($tickets as $ticket) {
            $products = $ticket->items->map(function ($item) {
                return $item->product ? $item->product->descricao : 'N/A';
            })->implode(', ');
            
            $statusClass = $statusClasses[$ticket->status] ?? 'status-default';
            $statusText = $statusMap[$ticket->status] ?? $ticket->status;
            
            $html .= '<tr>
                <td>' . htmlspecialchars($ticket->ticket_number) . '</td>
                <td>' . htmlspecialchars($ticket->client->razao_social ?? 'N/A') . '</td>
                <td>' . htmlspecialchars($products) . '</td>
                <td class="' . $statusClass . '">' . htmlspecialchars($statusText) . '</td>
                <td>' . $ticket->created_at->format('d/m/Y H:i:s') . '</td>
                <td>' . htmlspecialchars($ticket->numero_contrato) . '</td>
                <td>' . htmlspecialchars($ticket->numero_nf) . '</td>
            </tr>';
        }
        
        $html .= '</tbody></table></body></html>';
        
        $options = new Options();
        $options->set('defaultFont', 'Arial');
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();
        
        $fileName = 'tickets_' . date('Y-m-d_H-i-s') . '.pdf';
        
        // Return response with proper headers for download
        return response()->make($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Cache-Control' => 'private, max-age=0, must-revalidate',
            'Pragma' => 'public'
        ]);
    }
}