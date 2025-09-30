<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Dompdf\Dompdf;
use Dompdf\Options;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Only admins can view clients
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        $query = Client::withCount('tickets');
        
        // Apply filters
        if ($request->filled('razao_social')) {
            $query->where('razao_social', 'like', '%' . $request->razao_social . '%');
        }
        
        if ($request->filled('cnpj')) {
            $query->where('cnpj', 'like', '%' . $request->cnpj . '%');
        }
        
        if ($request->filled('email_notificacao')) {
            $query->where('email_notificacao', 'like', '%' . $request->email_notificacao . '%');
        }
        
        $clients = $query->latest()->paginate(10)->withQueryString();
        
        // Pass filters to the view
        $filters = $request->only(['razao_social', 'cnpj', 'email_notificacao']);
        
        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
            'filters' => $filters,
        ]);
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        // Only admins can view clients
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        // Load client with related data
        $client->loadCount('tickets');
        $client->load('users');
        
        // Get tickets for this client
        $tickets = Ticket::with(['items.product'])
            ->where('client_id', $client->id)
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Admin/Clients/Show', [
            'client' => $client,
            'tickets' => $tickets,
        ]);
    }
    
    /**
     * Export clients to Excel or PDF
     */
    public function export(Request $request, $format)
    {
        // Only admins can export clients
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        $query = Client::withCount('tickets');
        
        // Apply filters
        if ($request->filled('razao_social')) {
            $query->where('razao_social', 'like', '%' . $request->razao_social . '%');
        }
        
        if ($request->filled('cnpj')) {
            $query->where('cnpj', 'like', '%' . $request->cnpj . '%');
        }
        
        if ($request->filled('email_notificacao')) {
            $query->where('email_notificacao', 'like', '%' . $request->email_notificacao . '%');
        }
        
        $clients = $query->latest()->get();
        
        if ($format === 'excel') {
            return $this->exportToExcel($clients);
        } elseif ($format === 'pdf') {
            return $this->exportToPDF($clients);
        }
        
        return redirect()->back()->with('error', 'Formato de exportação inválido.');
    }
    
    /**
     * Export clients to Excel
     */
    private function exportToExcel($clients)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Set headers
        $sheet->setCellValue('A1', 'CNPJ');
        $sheet->setCellValue('B1', 'Razão Social');
        $sheet->setCellValue('C1', 'E-mail de Notificação');
        $sheet->setCellValue('D1', 'Quantidade de Tickets');
        $sheet->setCellValue('E1', 'Data de Criação');
        
        // Set data
        $row = 2;
        foreach ($clients as $client) {
            $sheet->setCellValue('A' . $row, $client->cnpj);
            $sheet->setCellValue('B' . $row, $client->razao_social);
            $sheet->setCellValue('C' . $row, $client->email_notificacao);
            $sheet->setCellValue('D' . $row, $client->tickets_count);
            $sheet->setCellValue('E' . $row, $client->created_at->format('d/m/Y H:i:s'));
            
            $row++;
        }
        
        // Auto-size columns
        foreach (range('A', 'E') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        
        // Set headers to bold
        $sheet->getStyle('A1:E1')->getFont()->setBold(true);
        
        // Create Excel file
        $writer = new Xlsx($spreadsheet);
        $fileName = 'clientes_' . date('Y-m-d_H-i-s') . '.xlsx';
        
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
     * Export clients to PDF
     */
    private function exportToPDF($clients)
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
            </style>
        </head>
        <body>
            <h1>Relatório de Clientes</h1>
            <table>
                <thead>
                    <tr>
                        <th>CNPJ</th>
                        <th>Razão Social</th>
                        <th>E-mail de Notificação</th>
                        <th>Quantidade de Tickets</th>
                        <th>Data de Criação</th>
                    </tr>
                </thead>
                <tbody>';
        
        foreach ($clients as $client) {
            $html .= '<tr>
                <td>' . htmlspecialchars($client->cnpj) . '</td>
                <td>' . htmlspecialchars($client->razao_social) . '</td>
                <td>' . htmlspecialchars($client->email_notificacao) . '</td>
                <td>' . $client->tickets_count . '</td>
                <td>' . $client->created_at->format('d/m/Y H:i:s') . '</td>
            </tr>';
        }
        
        $html .= '</tbody></table></body></html>';
        
        $options = new Options();
        $options->set('defaultFont', 'Arial');
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $fileName = 'clientes_' . date('Y-m-d_H-i-s') . '.pdf';
        
        // Return response with proper headers for download
        return response()->make($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Cache-Control' => 'private, max-age=0, must-revalidate',
            'Pragma' => 'public'
        ]);
    }
}