<section class="tw-space-y-6">
    <header>
        <h2 class="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-gray-100">
            {{ __('Delete Account') }}
        </h2>

        <p class="tw-mt-1 tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
            {{ __('Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.') }}
        </p>
    </header>

    <x-danger-button
        x-data=""
        x-on:click.prevent="$dispatch('open-modal', 'confirm-user-deletion')"
    >{{ __('Delete Account') }}</x-danger-button>

    <x-modal name="confirm-user-deletion" :show="$errors->userDeletion->isNotEmpty()" focusable>
        <div class="tw-p-6">
            <h2 class="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-gray-100">
                Você deseja realmente excluir sua conta?
            </h2>

            <p class="tw-mt-1 tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
                Para isso, por favor, entre em contato com nosso administrador no email <strong>admin@itechsoftmaster.com</strong> e solicite a exclusão completa dos seus dados.
                O prazo para realizar isto é de 7 dias até 15 dias úteis.
            </p>
        </div>
    </x-modal>
</section>
