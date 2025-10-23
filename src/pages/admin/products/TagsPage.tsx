import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TagsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Product Tags</h1>
      <p className="text-gray-600">
        Add and manage tags to help customers find products easily.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add New Tag Form */}
        <div className="md:col-span-1 space-y-4 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Add New Tag</h2>
          <div>
            <Label htmlFor="tag-name">Name</Label>
            <Input id="tag-name" placeholder="Tag Name" />
            <p className="text-xs text-gray-500 mt-1">
              The name is how it appears on your site.
            </p>
          </div>
          <div>
            <Label htmlFor="tag-slug">Slug</Label>
            <Input id="tag-slug" placeholder="e.g., modern-design" />
            <p className="text-xs text-gray-500 mt-1">
              The “slug” is the URL-friendly version of the name.
            </p>
          </div>
          <div>
            <Label htmlFor="tag-description">Description</Label>
            <Textarea
              id="tag-description"
              placeholder="Optional description for the tag"
            />
          </div>
          <Button className="w-full btn-primary">Add New Tag</Button>
        </div>

        {/* Tags List Table Placeholder */}
        <div className="md:col-span-2 bg-gray-50 p-8 rounded-lg text-center text-gray-500 border">
          Tags Data Table Placeholder
          <p className="text-sm mt-2">
            Existing tags will be listed here for editing and deletion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
