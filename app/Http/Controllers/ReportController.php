<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetAllReportRequest;
use App\Models\Report;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public readonly Report $report;

    public function __construct()
    {
        $this->report = new Report();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('reports');
    }

    public function getAll(GetAllReportRequest $request)
    {
        try {
            $data = $request->validated();
            $reports = $this->report->query();
            $reports->where('reports.user_id', auth()->user()->id);

            if (isset($data['filter_search'])) {

                $reports->where(function ($query) use ($data) {
                    $query->where('reports.status', 'like', '%' . $data['filter_search'] . '%')
                        ->orWhere('reports.priority', 'like', '%' . $data['filter_search'] . '%')
                        ->orWhere('reports.abstract', 'like', '%' . $data['filter_search'] . '%')
                        ->orWhere('reports.id', 'like', '%' . $data['filter_search'] . '%')
                        ->orWhere('reports.description', 'like', '%' . $data['filter_search'] . '%')
                        ->orWhereHas('requester', function (Builder $query) use ($data) {
                            $query->where('name', 'like', '%' . $data['filter_search'] . '%');
                        });
                });
            }
            $reports->with(['requester:id,name']);

            if ($data['search_out_date'] == 'false') {
                $reports->where('reports.created_at', 'like', $data['filter_date'] . '%');
            }

            if (isset($data['order_by']) && $data['order_by'] == 'requester_name') {
                $reports->join('requesters', 'reports.requester_id', '=', 'requesters.id')
                    ->orderBy('requesters.name', $data['order_direction'] ?? 'desc');
            } else {
                $reports->orderBy($data['order_by'] ?? 'created_at', $data['order_direction'] ?? 'desc');
            }


            $reports = $reports->paginate($data['per_page'] ?? 10)->onEachSide(1);

            if (!$reports) {
                throw new \Exception('Houve uma falha na consulta dos registros.');
            }

            return response()->json([
                'status' => 200,
                'data' => $reports,
                'message' => 'Registros encontados.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->guard()->user()->id;

            $this->report->create($data);

            return response()->json([
                'status' => 200,
                'data' => [],
                'message' => 'Relatório criado com sucesso.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $report = $this->report
                ->where('id', $id)
                ->where('user_id', auth()->user()->id)
                ->with(['requester:id,name'])
                ->first();

            if (!$report) {
                throw new \Exception('Relatório não encontrado');
            }

            return response()->json([
                'status' => 200,
                'data' => $report,
                'message' => 'Relatório encontrado.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportRequest $request, int $reportId): JsonResponse
    {
        try {
            $data = $request->validated();

            $result = $this->report
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $reportId)
                ->update($data);

            if (!$result) {
                throw new \Exception('Houve um erro ao atualizar o relatório.');
            }

            return response()->json([
                'status' => 200,
                'message' => 'Relatório atualizado com sucesso!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $reportId)
    {
        try {

            $result = $this->report
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $reportId)
                ->delete();
            if (!$result) {
                throw new \Exception('Houve um erro ao excluir o relatório.');
            }

            return response()->json([
                'status' => 200,
                'message' => 'Relatório excluido com sucesso!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
