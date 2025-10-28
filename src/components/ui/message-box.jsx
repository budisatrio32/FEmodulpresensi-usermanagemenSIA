"use client"

function ErrorMessageBox({
    message,
}) {
    return (
        <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error: </p>
            <p>{message}</p>
        </div>
    );
}
function ErrorMessageBoxWithButton({
    message,
    action,
    btntext,
}) {
    return (
        <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error: </p>
            <p>{message}</p>
            <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded transition-colors duration-200 hover:bg-red-600 hover:shadow-md" onClick={action}>
                {btntext ? btntext : 'Coba Lagi'}
            </button>
        </div>
    );
}
function SuccessMessageBox({
    message,
}) {
    return (
        <div className="my-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Success: </p>
            <p>{message}</p>
        </div>
    );
}
function SuccessMessageBoxWithButton({
    message,
    action,
    btntext,
}) {
    return (
        <div className="my-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Success: </p>
            <p>{message}</p>
            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded transition-colors duration-200 hover:bg-green-600 hover:shadow-md" onClick={action}>
                {btntext ? btntext : 'Lanjutkan'}
            </button>
        </div>
    );
}

export { 
    ErrorMessageBox,
    ErrorMessageBoxWithButton,
    SuccessMessageBox,
    SuccessMessageBoxWithButton,
};