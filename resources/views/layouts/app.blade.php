<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="tw-dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Reports - Gerenciador de Relatórios">
    <meta property="og:description" content="Sistema dedicado a gerenciar relatórios de atendimentos e atividades executadas.">
    <meta property="og:image" content="{{ asset('/assets/img/logo-cinza.png') }}">
    <meta property="og:url" content="https://reports-oczn3.ondigitalocean.app/">
    <meta property="og:type" content="website">

    <title>Reports</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/introjs.css">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet"/>
    <link type="image/png" sizes="64x64" rel="icon" href="https://img.icons8.com/color/48/graph-report.png"/>

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    @yield('scripts')
</head>

<body class="tw-font-sans tw-antialiased" data-bs-theme="dark">
<div class="modal fade" id="my-modal-loading" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="container">
            <span class="loader meu-loader"></span>
        </div>
    </div>
</div>
<div class="tw-min-h-screen tw-bg-gray-100 dark:tw-bg-gray-900">
    @include('layouts.navigation')

    <!-- Page Heading -->
    @if (isset($header))
        <header class="tw-bg-white dark:tw-bg-gray-800 tw-shadow">
            <div class="tw-max-w-7xl tw-mx-auto tw-py-6 tw-px-4 sm:tw-px-6 lg:tw-px-8">
                {{ $header }}
            </div>
        </header>
    @endif

    <div>
        @yield('conteudo')
    </div>

</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/intro.min.js"></script>
@yield('script-after-body')
</body>
</html>
