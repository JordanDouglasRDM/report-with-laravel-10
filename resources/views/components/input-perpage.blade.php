@props([
    'route'
])
<div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Dropdown button
    </button>
    <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
</div>
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
