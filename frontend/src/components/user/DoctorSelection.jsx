import { Mail, Phone, Star, MapPin, Clock, User } from "lucide-react";

const DoctorSelectionStep = ({ doctors, onSelect }) => {
  return (
    <div className="bg-[var(--custom-orange-100)] w-full p-2 sm:p-8 rounded-[20px] border-2 border-[var(--custom-orange-200)] flex items-center justify-center shadow-md">
      {/* <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
        <Stethoscope className="w-8 h-8 text-[var(--custom-orange-500)]" />
        <h2 className="text-center font-bold text-3xl text-[var(--custom-orange-500)] uppercase">
          Select a Doctor / Counsellor
        </h2>
      </div> */}

      {doctors.length > 0 ? (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group w-full bg-white hover:bg-[var(--custom-orange-50)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-[var(--custom-orange-100)] hover:border-[var(--custom-orange-200)]"
              onClick={() => onSelect(doctor)}
            >
              <div className="flex w-full flex-col justify-center items-center sm:flex-row gap-3 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-[var(--custom-orange-100)] to-[var(--custom-orange-200)] rounded-full transition-all duration-300">
                    {doctor.img != "" ? (
                      <img
                        src={doctor.img}
                        alt="Profile"
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    ) : (
                      <div className="p-4">
                        <User className="w-8 h-8  text-[var(--custom-orange-700)]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-0">
                  <h3 className="text-xl text-center sm:text-left font-bold text-[var(--custom-orange-800)] group-hover:text-[var(--custom-orange-900)] transition-colors duration-300">
                    {doctor.name}
                  </h3>
                  <p className="text-center sm:text-left text-sm text-gray-600 line-clamp-2">
                    {doctor.desc || "No description available."}
                  </p>
                  <div className="flex-1 space-y-2 mt-5 sm:mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-[var(--custom-orange-700)] transition-colors duration-300">
                      <div className="bg-[var(--custom-orange-100)] p-1.5 rounded-full">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>{doctor.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-[var(--custom-orange-700)] transition-colors duration-300">
                      <div className="bg-[var(--custom-orange-100)] p-1.5 rounded-full">
                        <Mail className="w-4 h-4" />
                      </div>
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
