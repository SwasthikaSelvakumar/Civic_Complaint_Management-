import React from 'react';
import { MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ComplaintCard = ({ complaint }) => {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    InProgress: "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700"
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {complaint.title}
        </h3>

        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[complaint.status]}`}>
          {complaint.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4">
        {complaint.description}
      </p>

      <div className="flex justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {complaint.location}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> {complaint.date}
        </span>
      </div>
    </div>
  );
};

export default ComplaintCard;
