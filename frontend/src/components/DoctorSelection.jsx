import { Mail, Phone, Stethoscope, User } from "lucide-react";

const DoctorSelectionStep = ({ doctors, onSelect }) => {
  return (
    <div className="bg-[var(--custom-white)] w-full max-w-[1200px] p-4 md:p-8 rounded-[20px] border-2 border-[var(--custom-orange-200)] shadow-xl">
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
        <Stethoscope className="w-8 h-8 text-[var(--custom-orange-500)]" />
        <h2 className="text-center font-bold text-3xl text-[var(--custom-orange-500)] uppercase">
          Select a Doctor / Counsellor
        </h2>
      </div>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-[var(--custom-orange-50)] hover:bg-[var(--custom-orange-100)] p-3 lg:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-[var(--custom-orange-200)] hover:border-[var(--custom-orange-300)]"
              onClick={() => onSelect(doctor)}
            >
              <div className="flex items-start gap-2 lg:gap-4 md:flex-col md:justify-center md:items-center lg:flex-row">
                <div className="bg-[var(--custom-orange-200)] rounded-full p-3 group-hover:bg-[var(--custom-orange-300)] transition-colors duration-300">
                  <User className="w-6 h-6 text-[var(--custom-orange-700)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--custom-orange-800)] transition-colors duration-300">
                    {doctor.name}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--custom-orange-700)] line-clamp-2">
                    {doctor.desc ? doctor.desc : "No description available."}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--custom-orange-700)]">
                      <Phone className="w-4 h-4" />
                      <span>{doctor.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--custom-orange-700)]">
                      <Mail className="w-4 h-4" />
                      <span>{doctor.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-[var(--custom-orange-300)] mx-auto mb-4" />
          <p className="text-xl font-semibold text-[var(--custom-orange-700)]">
            No doctors available at the moment.
          </p>
          <p className="mt-2 text-[var(--custom-orange-600)]">
            Please check back later or contact support for assistance.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorSelectionStep;
