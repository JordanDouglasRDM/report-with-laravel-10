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

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <link type="image/png" sizes="64x64" rel="icon" href="https://img.icons8.com/color/48/graph-report.png"/>

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="tw-font-sans tw-text-gray-900 tw-antialiased">
<div class="tw-min-h-screen tw-flex tw-flex-col sm:tw-justify-center tw-items-center tw-pt-6 sm:tw-pt-0 tw-bg-gray-100 dark:tw-bg-gray-900">
    <div>
        <a href="/">
            <x-application-logo class="tw-w-20 tw-h-20 tw-fill-current tw-text-gray-500" />
        </a>
    </div>

    <div class="tw-w-full sm:tw-max-w-md tw-mt-6 tw-px-6 tw-py-4 tw-bg-white dark:tw-bg-gray-800 tw-shadow-md tw-overflow-hidden sm:tw-rounded-lg">
        {{ $slot }}
    </div>
</div>
</body>
</html>
