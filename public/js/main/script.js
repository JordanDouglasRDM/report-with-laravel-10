function loading() {
    const modal = document.createElement("div");
    modal.innerHTML = `
    <div class="modal fade" id="my-modal-loading" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="container">
                <span class="loader meu-loader"></span>
            </div>
        </div>
    </div>
    `;

    return new bootstrap.Modal(document.getElementById('my-modal-loading'), {
        keyboard: false,
        backdrop: 'static'
    });
}

function handleErrorsResponse(errorAxios) {
    const message = errorAxios.response.data.message;

    const errorCode = errorAxios.response.data.status;
    let errors = errorAxios.response.data.error;

    if (errorCode === 422) { //erros relacionados ao form request
        const errorObject = errorAxios.response.data.error;
        const errorArray = Object.values(errorObject);
        errors = errorArray.join('<br>');

        if (errorObject) {
            for (const key in errorObject) {
                const field = document.getElementById(key);
                if (field) {
                    field.classList.add('border-danger-subtle');
                    setTimeout(() => {
                        field.classList.remove('border-danger-subtle');
                    }, 4000)
                }
            }
        }
    }
    const toast = initializeToast()
    toast.fire({
        icon: "error",
        title: message,
        html: errors,
        timer: 4000
    });
}

function initializeToast() {
    return Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
}
