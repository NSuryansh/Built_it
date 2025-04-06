import React from 'react'

const DeletePopup = ({docId, handleDeletePopup, handleDelete}) => {
         

    //   const handleDeletePopup()

    return (
        <>
            <div className="flex w-screen h-screen absolute bg-black opacity-50"></div>
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    {/* <h2 className="text-xl font-semibold text-red-600">Session Timeout</h2> */}
                    <p className="mt-2">Are you sure you want to remove the doctor?</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                // handleDeletePopup(true);
                                handleDelete(docId)
                                // console.log(docId)
                            }}
                            className="mt-4 w-16 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => {
                                handleDeletePopup(docId, false);
                            }}
                            className="mt-4 w-16 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            No
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default DeletePopup