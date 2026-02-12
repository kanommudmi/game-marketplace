import { Button } from "@/components/ui/button";
import { ShieldAlert, Lock, ArrowLeft, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Access Denied
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          You don't have permission to access the admin dashboard. This area is
          restricted to administrators only.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login as Admin
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Secure Admin Area</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
