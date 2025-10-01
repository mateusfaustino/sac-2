<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\TicketItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Dompdf\Dompdf;
use Dompdf\Options;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Only admins can view products
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        $query = Product::withCount('ticketItems');
        
        // Apply filters
        if ($request->filled('codigo')) {
            $query->where('codigo', 'like', '%' . $request->codigo . '%');
        }
        
        if ($request->filled('descricao')) {
            $query->where('descricao', 'like', '%' . $request->descricao . '%');
        }
        
        if ($request->filled('status')) {
            $query->where('ativo', $request->status === 'ativo' ? 1 : 0);
        }
        
        $products = $query->latest()->paginate(10)->withQueryString();
        
        // Transform the products to include status field
        $products->getCollection()->transform(function ($product) {
            $product->status = $product->ativo ? 'ativo' : 'inativo';
            return $product;
        });
        
        // Pass filters to the view
        $filters = $request->only(['codigo', 'descricao', 'status']);
        
        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $filters,
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only admins can create products
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        return Inertia::render('Admin/Products/Create');
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Only admins can create products
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'codigo' => 'required|unique:products,codigo',
            'descricao' => 'required|string|max:255',
            'ativo' => 'required|boolean',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Create the product
        $product = Product::create($request->only(['codigo', 'descricao', 'ativo']));
        
        return redirect()->route('admin.products.index')->with('success', 'Produto criado com sucesso.');
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // Only admins can view products
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        // Load product with related data
        $product->loadCount('ticketItems');
        
        // Add status field for consistency
        $product->status = $product->ativo ? 'ativo' : 'inativo';
        
        // Get ticket items for this product
        $ticketItems = TicketItem::with(['ticket.client', 'ticket'])
            ->where('product_id', $product->id)
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
            'ticketItems' => $ticketItems,
        ]);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Only admins can delete products
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        // Check if product has associated tickets
        if ($product->ticketItems()->count() > 0) {
            return redirect()->back()->with('error', 'Não é possível excluir um produto que possui tickets associados.');
        }
        
        // Delete the product
        $product->delete();
        
        return redirect()->route('admin.products.index')->with('success', 'Produto excluído com sucesso.');
    }
    
    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        // Only admins can restore products
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        // Restore the product
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();
        
        return redirect()->back()->with('success', 'Produto restaurado com sucesso.');
    }
    
    /**
     * Export products to Excel or PDF
     */
    public function export(Request $request, $format)
    {
        // Only admins can export products
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('client.dashboard');
        }
        
        $query = Product::withCount('ticketItems');
        
        // Apply filters
        if ($request->filled('codigo')) {
            $query->where('codigo', 'like', '%' . $request->codigo . '%');
        }
        
        if ($request->filled('descricao')) {
            $query->where('descricao', 'like', '%' . $request->descricao . '%');
        }
        
        if ($request->filled('status')) {
            $query->where('ativo', $request->status === 'ativo' ? 1 : 0);
        }
        
        $products = $query->latest()->get();
        
        // Transform the products to include status field
        $products->transform(function ($product) {
            $product->status = $product->ativo ? 'ativo' : 'inativo';
            return $product;
        });
        
        if ($format === 'excel') {
            return $this->exportToExcel($products);
        } elseif ($format === 'pdf') {
            return $this->exportToPDF($products);
        }
        
        return redirect()->back()->with('error', 'Formato de exportação inválido.');
    }
    
    /**
     * Export products to Excel
     */
    private function exportToExcel($products)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Set headers
        $sheet->setCellValue('A1', 'Código');
        $sheet->setCellValue('B1', 'Descrição');
        $sheet->setCellValue('C1', 'Status');
        $sheet->setCellValue('D1', 'Quantidade de Tickets');
        $sheet->setCellValue('E1', 'Data de Criação');
        
        // Set data
        $row = 2;
        foreach ($products as $product) {
            $sheet->setCellValue('A' . $row, $product->codigo);
            $sheet->setCellValue('B' . $row, $product->descricao);
            $sheet->setCellValue('C' . $row, $product->status === 'ativo' ? 'Ativo' : 'Inativo');
            $sheet->setCellValue('D' . $row, $product->ticket_items_count);
            $sheet->setCellValue('E' . $row, $product->created_at->format('d/m/Y H:i:s'));
            
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
        $fileName = 'produtos_' . date('Y-m-d_H-i-s') . '.xlsx';
        
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
     * Export products to PDF
     */
    private function exportToPDF($products)
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
            <h1>Relatório de Produtos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Quantidade de Tickets</th>
                        <th>Data de Criação</th>
                    </tr>
                </thead>
                <tbody>';
        
        foreach ($products as $product) {
            $html .= '<tr>
                <td>' . htmlspecialchars($product->codigo) . '</td>
                <td>' . htmlspecialchars($product->descricao) . '</td>
                <td>' . ($product->status === 'ativo' ? 'Ativo' : 'Inativo') . '</td>
                <td>' . $product->ticket_items_count . '</td>
                <td>' . $product->created_at->format('d/m/Y H:i:s') . '</td>
            </tr>';
        }
        
        $html .= '</tbody></table></body></html>';
        
        $options = new Options();
        $options->set('defaultFont', 'Arial');
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $fileName = 'produtos_' . date('Y-m-d_H-i-s') . '.pdf';
        
        // Return response with proper headers for download
        return response()->make($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Cache-Control' => 'private, max-age=0, must-revalidate',
            'Pragma' => 'public'
        ]);
    }
}