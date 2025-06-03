import React from "react";

const DeletePopup = ({ doc, handleToggleDocPopup, handleToggleDoc, text }) => {
  return (
    <>
      <div className="flex w-screen h-screen fixed bg-custom-black opacity-50"></div>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-custom-white p-6 rounded-lg shadow-lg text-center">
          <p className="mt-2">{text}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                handleToggleDoc(doc);
              }}
              className="mt-4 w-16 cursor-pointer bg-custom-red-500 text-custom-white px-4 py-2 rounded-lg"
            >
              Yes
            </button>
            <button
              onClick={() => {
                handleToggleDocPopup(doc, false);
              }}
              className="mt-4 w-16 cursor-pointer bg-custom-red-500 text-custom-white px-4 py-2 rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePopup;
