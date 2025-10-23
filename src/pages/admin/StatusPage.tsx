import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const statusData = [
  {
    component: "Main API Server",
    status: "Operational",
    details: "All systems normal.",
  },
  {
    component: "Database Connection",
    status: "Operational",
    details: "Connected and responding.",
  },
  {
    component: "Payment Gateway",
    status: "Operational",
    details: "Transactions are being processed.",
  },
  {
    component: "Email Service",
    status: "Degraded",
    details: "Experiencing minor delays in email delivery.",
  },
  {
    component: "Image Processing",
    status: "Operational",
    details: "Uploads are working correctly.",
  },
  {
    component: "Admin Authentication",
    status: "Outage",
    details: "Login service is currently unavailable.",
  },
];

const getStatusIcon = (status) => {
  switch (status) {
    case "Operational":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "Degraded":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "Outage":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const StatusPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">System Status</h1>
      <p className="text-gray-600">
        A real-time overview of our system's health and performance.
      </p>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold">All Systems Status</h2>
        </div>
        <div className="divide-y">
          {statusData.map((item, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{item.component}</p>
                <p className="text-sm text-gray-500">{item.details}</p>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                {getStatusIcon(item.status)}
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
