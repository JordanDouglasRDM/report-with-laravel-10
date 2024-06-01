<div class="btn-group dropdown">
    <button class="btn btn-primary m-2 dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
        Por página
    </button>
    <div class="dropdown-menu" aria-labelledby="perPageDropdown">
        <li>
            <a class="dropdown-item {{ request('per-page') == 10 ? 'active' : '' }}">
                10
            </a>
        </li>
        <li>
            <a class="dropdown-item {{ request('per-page') == 25 ? 'active' : '' }}">
                25
            </a>
        </li>
        <li>
            <a class="dropdown-item {{ request('per-page') == 50 ? 'active' : '' }}">
                50
            </a>
        </li>
    </div>
</div>
