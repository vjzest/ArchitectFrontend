import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ReviewsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Product Reviews</h1>
      <p className="text-gray-600">
        Moderate and manage all customer reviews from here.
      </p>

      {/* Filters and Search */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search reviews by product or customer..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">Apply Filters</Button>
      </div>

      {/* Reviews Table */}
      <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500 border">
        Reviews Data Table Placeholder
      </div>
    </div>
  );
};

export default ReviewsPage;
