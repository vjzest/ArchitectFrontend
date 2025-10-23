import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BrandsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Product Brands</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add New Brand Form */}
        <div className="md:col-span-1 space-y-4 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Add New Brand</h2>
          <div>
            <Label htmlFor="brand-name">Name</Label>
            <Input id="brand-name" placeholder="Brand Name" />
          </div>
          <div>
            <Label htmlFor="brand-slug">Slug</Label>
            <Input id="brand-slug" placeholder="e.g., brand-name" />
          </div>
          <div>
            <Label htmlFor="brand-description">Description</Label>
            <Textarea
              id="brand-description"
              placeholder="Optional description for the brand"
            />
          </div>
          <Button className="w-full btn-primary">Add New Brand</Button>
        </div>

        {/* Brands List Table */}
        <div className="md:col-span-2 bg-gray-50 p-8 rounded-lg text-center text-gray-500 border">
          Brands Data Table Placeholder
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
