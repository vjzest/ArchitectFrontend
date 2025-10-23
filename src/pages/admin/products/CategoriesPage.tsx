import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CategoriesPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-4">
        <h2 className="text-xl font-semibold">Add New Category</h2>
        <div>
          <Label htmlFor="cat-name">Name</Label>
          <Input id="cat-name" placeholder="Category Name" />
        </div>
        <div>
          <Label htmlFor="cat-slug">Slug</Label>
          <Input id="cat-slug" placeholder="category-slug" />
        </div>
        <Button className="btn-primary">Add Category</Button>
      </div>
      <div className="md:col-span-2 bg-gray-50 p-8 rounded-lg text-center text-gray-500">
        Categories Table Placeholder
      </div>
    </div>
  </div>
);
export default CategoriesPage;
