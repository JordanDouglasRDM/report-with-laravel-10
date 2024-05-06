<x-app-layout>
    <div class="container mt-3" data-bs-theme="dark">
        <div class="mb-3">
            <x-input-perpage route="user.index" />
        </div>
        <table class="table table-striped table-hover">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Nível de acesso</th>
                <th scope="col">Email</th>
            </tr>
            </thead>
            <tbody>
            @foreach ($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->phone_number }}</td>
                    <td>{{ $user->level }}</td>
                    <td>{{ $user->email }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        {{ $users->onEachSide(1)->links() }}

    </div>
</x-app-layout>
