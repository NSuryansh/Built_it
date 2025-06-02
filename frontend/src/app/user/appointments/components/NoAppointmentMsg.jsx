import { Calendar } from "lucide-react";

export const NoAppointmentsMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <Calendar className="h-12 w-12 text-gray-400 mb-3" />
    <p className="text-lg text-gray-500 font-medium">{message}</p>
  </div>
);
