<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetAllUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public readonly User $user;

    public function __construct()
    {
        $this->user = new User();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('users');
    }

    public function getAll(GetAllUserRequest $request)
    {
        $data = $request->validated();
        $users = $this->user->query(); // Inicialize a consulta aqui

        if (isset($data['filter-search'])) {
            $users->where(function ($query) use ($data) {
                $query->where('name', 'like', '%' . $data['filter-search'] . '%')
                    ->orWhere('email', 'like', '%' . $data['filter-search'] . '%')
                    ->orWhere('phone_number', 'like', '%' . $data['filter-search'] . '%')
                    ->orWhere('level', 'like', '%' . $data['filter-search'] . '%');
            });
        }
        $users = $users->paginate($data['per_page'] ?? 10);

        return response()->json([
            'data' => $users,
            'message' => 'Usuários encontrados com sucesso!'
        ], 200);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = $this->user->where('id', $id)->first();

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            return response()->json([
                'status' => 200,
                'data' => $user,
                'message' => 'Usuário encontrado.'
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
    public function update(UpdateUserRequest $request, int $userId): JsonResponse
    {
        try {
            $data = $request->validated();

            if (auth()->user()->id == $userId) {
                if(isset($data['level'])) {
                  throw new \Exception('Você não pode alterar seu próprio nível de acesso.');
                }
            }

            $result = $this->user->where('id', $userId)->update($data);
            if (!$result) {
                throw new \Exception('Houve um erro ao atualizar o usuário.');
            }

            return response()->json([
                'status' => 200,
                'message' => 'User atualizado com sucesso!',
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
    public function destroy(string $id)
    {
        //
    }
}
