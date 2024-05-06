@props([
    'route'
])
<div class="btn-group">
    <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Registros por página
    </button>
    <ul class="dropdown-menu">
        <li><a class="dropdown-item" href=" {{ route($route) . '?per-page=10' }}">10</a></li>
        <li><a class="dropdown-item" href=" {{ route($route) . '?per-page=25' }}">25</a></li>
        <li><a class="dropdown-item" href=" {{ route($route) . '?per-page=50' }}">50</a></li>
    </ul>
</div>
