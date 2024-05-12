export function initializeToast() {
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

export function users() {
    console.log('meu usuário')
}

export function loading() {
    return new bootstrap.Modal(document.getElementById('my-modal-loading'), {
        keyboard: false,
        backdrop: 'static'
    });
}
