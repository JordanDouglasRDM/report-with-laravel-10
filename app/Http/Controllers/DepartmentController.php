<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetAllDepartmentsRequest;
use App\Models\Department;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;

class DepartmentController extends Controller
{
    protected readonly Department $department;

    public function __construct()
    {
        $this->department = new Department();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('departments');
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
    public function store(StoreDepartmentRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->guard()->user()->id;

            $this->department->create($data);

            return response()->json([
                'status' => 200,
                'data' => [],
                'message' => 'Departamento Criado.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAll(GetAllDepartmentsRequest $request)
    {
        try {
            $data = $request->validated();

            $departments = $this->department->query()->where('user_id', auth()->guard()->user()->id);


            if (isset($data['filter_search'])) {

                $departments->where(function ($query) use ($data) {
                    $query->where('name', 'like', '%' . $data['filter_search'] . '%');
                });
            }
            $departments->orderBy($data['order_by'] ?? 'created_at', $data['order_direction'] ?? 'desc');

            $departments = $departments
                ->withCount(['requesters'])
                ->get();

            if (!$departments) {
                throw new \Exception('Houve uma falha na consulta dos registros.');
            }

            return response()->json([
                'status' => 200,
                'data' => $departments,
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
            $department = $this->department
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $id)
                ->withCount(['requesters'])
                ->first();


            if (!$department) {
                throw new \Exception('Departamento não encontrado');
            }

            return response()->json([
                'status' => 200,
                'data' => $department,
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
    public function edit(Department $department)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, int $departmentId)
    {
        try {
            $data = $request->validated();

            $result = $this->department
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $departmentId)
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
    public function destroy(int $departmentId)
    {
        try {

            $result = $this->department
                ->where('user_id', auth()->guard()->user()->id)
                ->where('id', $departmentId)
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
                $error = 'Você não pode excluir um departamento que possua funcionários.';
            }

            return response()->json([
                'status' => 500,
                'message' => 'Erro interno do servidor',
                'error' => $error
            ], 500);
        }
    }
}
