import { useEffect, useState } from "react";
import CustomToast from "../common/CustomToast";
import { UserMinus, Users, ArrowRightLeft, X } from "lucide-react";

const DeletePopup = ({
  doc,
  handleToggleDocPopup,
  handleToggleDoc,
  text,
  id,
  doctors,
}) => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transferMap, setTransferMap] = useState({});

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/getUsersForDeactivation?doc_id=${id}`,
        { headers: { Authorization: "Bearer " + token } },
      );
      const data = await response.json();
      setPatients(data);
      const initialMap = {};
      data.forEach((p) => (initialMap[p.id] = ""));
      setTransferMap(initialMap);
    } catch (error) {
      CustomToast("Error fetching users", "green");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUsers();
  }, [id]);

  const handleSelectChange = (patientId, doctorId) => {
    setTransferMap((prev) => ({ ...prev, [patientId]: doctorId }));
  };

  const isReadyToSubmit = () => {
    return (
      patients.length === 0 ||
      Object.values(transferMap).every((val) => val !== "")
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      {/* Backdrop with a blur effect for a modern feel */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => handleToggleDocPopup(doc, false)}
      ></div>

      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header section */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <UserMinus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Deactivate Therapist
              </h3>
              <p className="text-xs text-red-600 font-medium uppercase tracking-wider">
                Action Required: Client Transfer
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggleDocPopup(doc, false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body section */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              {text ||
                "To deactivate this doctor, you must re-assign their current active clients to ensure continuous care."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold text-sm border-b pb-2">
              <Users className="w-4 h-4" />
              <h4>Client Reassignment List ({patients.length})</h4>
            </div>

            {patients.length > 0 ? (
              patients.map((patient) => (
                <div
                  key={patient.id}
                  className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {patient.username}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      ID: #{patient.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ArrowRightLeft className="w-4 h-4 text-slate-300" />
                    <select
                      className="min-w-[180px] bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none transition-shadow hover:shadow-sm"
                      value={transferMap[patient.id] || ""}
                      onChange={(e) =>
                        handleSelectChange(patient.id, e.target.value)
                      }
                    >
                      <option value="">Transfer to...</option>
                      {doctors
                        ?.filter((d) => d.id !== id)
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name || d.username}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm italic">
                  No clients currently assigned to this doctor.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={() => handleToggleDocPopup(doc, false)}
            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!isReadyToSubmit()}
            onClick={() => handleToggleDoc(doc, transferMap)}
            className={`px-6 py-2 text-sm font-bold rounded-lg shadow-md transition-all ${
              isReadyToSubmit()
                ? "bg-red-500 text-white hover:bg-red-600 active:scale-95"
                : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            Confirm Deactivation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
