<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetAllRequesterRequest;
use App\Models\Requester;
use App\Http\Requests\StoreRequesterRequest;
use App\Http\Requests\UpdateRequesterRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class RequesterController extends Controller
{
    protected readonly Requester $requester;

    public function __construct()
    {
        $this->requester = new Requester();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('requesters');
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
    public function store(StoreRequesterRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->guard()->user()->id;

            $this->requester->create($data);

            return response()->json([
                'status' => 200,
                'data' => [],
                'message' => 'Funcionário criado com sucesso.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAll(GetAllRequesterRequest $request)
    {
        try {
            $data = $request->validated();

            $requesters = $this->requester->query();

            if (isset($data['filter_search'])) {
                $requesters->where(function (Builder $query) use ($data) {
                    $query
                        ->where('requesters.name', 'like', '%' . $data['filter_search'] . '%')
                        ->orWhere('requesters.id', 'like', '%' . $data['filter_search'] . '%')
                        ->orWhereHas('department', function (Builder $query) use ($data) {
                            $query->where('name', 'like', '%' . $data['filter_search'] . '%');
                        });
                });
            }

            $orderBy = $data['order_by'] ?? 'created_at';
            $orderDirection = $data['order_direction'] ?? 'desc';

            if ($orderBy == 'department') {
                $requesters->join('departments', 'departments.id', '=', 'requesters.department_id')
                    ->orderBy('departments.name', $orderDirection)
                    ->select('requesters.*');
            } else {
                $requesters->orderBy($orderBy, $orderDirection);
            }

            $requesters = $requesters
                ->where('requesters.user_id', auth()->guard()->user()->id)
                ->with(['department:id,name'])
                ->withCount(['reports'])
                ->get();

            if (!$requesters) {
                throw new \Exception('Houve uma falha na consulta dos registros.');
            }

            return response()->json([
                'status' => 200,
                'data' => $requesters,
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
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $requester = $this->requester
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $id)
                ->with(['department'])
                ->withCount(['reports'])
                ->first();


            if (!$requester) {
                throw new \Exception('Departamento não encontrado');
            }

            return response()->json([
                'status' => 200,
                'data' => $requester,
                'message' => 'Departamento encontrado.'
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
    public function edit(Requester $requester)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequesterRequest $request, int $requesterId)
    {
        try {
            $data = $request->validated();

            $result = $this->requester
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $requesterId)
                ->update($data);

            if (!$result) {
                throw new \Exception('Houve um erro ao atualizar o departamento.');
            }

            return response()->json([
                'status' => 200,
                'message' => 'Departamento atualizado com sucesso!',
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
    public function destroy(int $requesterId)
    {
        try {

            $result = $this->requester
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $requesterId)
                ->delete();
            if (!$result) {
                throw new \Exception('Houve um erro ao excluir o departamento.');
            }

            return response()->json([
                'status' => 200,
                'message' => 'Departamento excluido com sucesso!',
            ]);
        } catch (\Exception $e) {
            $error = $e->getMessage();
            if ($e->getCode() == 23000) {
                $error = 'Violação de chave estrangeira.';
            }

            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $error
            ], 500);
        }
    }
}
