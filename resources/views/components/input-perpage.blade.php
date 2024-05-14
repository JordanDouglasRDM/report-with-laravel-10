@props([
    'route'
])
<div class="btn-group dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
        Registros por página
    </button>
    <div class="dropdown-menu" aria-labelledby="perPageDropdown">
        <li>
            <a class="dropdown-item {{ request('per-page') == 10 ? 'active' : '' }}"

               href="{{ route($route, ['per-page' => 10]) }}"
            >
                10
            </a>
        </li>
        <li>
            <a class="dropdown-item {{ request('per-page') == 25 ? 'active' : '' }}"
               href="{{ route($route, ['per-page' => 25]) }}">
                25
            </a>
        </li>
        <li>
            <a class="dropdown-item {{ request('per-page') == 50 ? 'active' : '' }}"
               href="{{ route($route, ['per-page' => 50]) }}">
                50
            </a>
        </li>

    </div>
</div>
