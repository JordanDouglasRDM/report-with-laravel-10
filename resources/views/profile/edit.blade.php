@extends('layouts.app')
@section('scripts')
    <script defer src="{{ asset('/js/pages/edit-profile.js') }}"></script>
@endsection

@section('conteudo')
    <x-slot name="header">
        <h2 class="tw-font-semibold tw-text-xl tw-text-gray-800 dark:tw-text-gray-200 tw-leading-tight">
            {{ __('Profile') }}
        </h2>
    </x-slot>

    <div class="tw-py-12">
        <div class="tw-max-w-7xl tw-mx-auto sm:tw-px-6 lg:tw-px-8 tw-space-y-6">
            <div class="tw-p-4 sm:tw-p-8 tw-bg-white dark:tw-bg-gray-800 tw-shadow sm:tw-rounded-lg">
                <div class="tw-max-w-xl">
                    @include('profile.partials.update-profile-information-form')
                </div>
            </div>

            <div class="tw-p-4 sm:tw-p-8 tw-bg-white dark:tw-bg-gray-800 tw-shadow sm:tw-rounded-lg">
                <div class="tw-max-w-xl">
                    @include('profile.partials.tutorials')
                </div>
            </div>
            <div class="tw-p-4 sm:tw-p-8 tw-bg-white dark:tw-bg-gray-800 tw-shadow sm:tw-rounded-lg">
                <div class="tw-max-w-xl">
                    @include('profile.partials.update-password-form')
                </div>
            </div>

            <div class="tw-p-4 sm:tw-p-8 tw-bg-white dark:tw-bg-gray-800 tw-shadow sm:tw-rounded-lg">
                <div class="tw-max-w-xl">
                    @include('profile.partials.delete-user-form')
                </div>
            </div>
        </div>
    </div>
@endsection
@section('script-after-body')
    <scrip src="{{ asset('/js/main/helpers.js') }}"></scrip>
@endsection
