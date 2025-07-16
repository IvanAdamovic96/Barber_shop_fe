import Swal from 'sweetalert2';

const bootstrapStyle = {
    popup: 'card',
    cancelButton: 'btn btn-danger',
    denyButton: 'btn btn-secondary',
    confirmButton: 'btn btn-primary'

}

export function showConfirm(message: string, callback: Function) {
    Swal.fire({
        title: message,
        showCancelButton: true,
        confirmButtonText: 'Potvrdi',
        cancelButtonText: 'Otkaži',
        icon: "question",
        customClass: bootstrapStyle
    }).then(result => {
        if (result.isConfirmed) {
            callback()
            Swal.fire({
                title: "Uspešno",
                confirmButtonText: 'Ok',
                icon: "success",
                customClass: bootstrapStyle
            })
        }
    })
}

export function showError(message: string) {
    Swal.fire({
        title: 'Greška!',
        confirmButtonText: 'Ok',
        text: message,
        icon: 'error',
        customClass: bootstrapStyle
    })
}

export function showSuccess(message: string) {
    Swal.fire({
        title: "Uspešno",
        confirmButtonText: 'Ok',
        text: message,
        icon: "success",
        customClass: bootstrapStyle
    })
}