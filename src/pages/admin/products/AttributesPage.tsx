import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react"; // Icon for "Configure"

const mockAttributes = [
  {
    id: 1,
    name: "Facing Direction",
    slug: "facing-direction",
    terms: ["North", "East", "West", "South"],
  },
  {
    id: 2,
    name: "Number of Floors",
    slug: "num-floors",
    terms: ["G+1", "G+2", "G+3"],
  },
  {
    id: 3,
    name: "Plot Size Category",
    slug: "plot-size",
    terms: ["Small", "Medium", "Large"],
  },
];

const AttributesPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Product Attributes</h1>
      <p className="text-gray-600">
        Create global attributes like 'Facing Direction' or 'Plot Size' to use
        on your products.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add New Attribute Form */}
        <div className="md:col-span-1 space-y-4 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">
            Add New Attribute
          </h2>
          <div>
            <Label htmlFor="attr-name">Name</Label>
            <Input id="attr-name" placeholder="e.g., Facing Direction" />
          </div>
          <div>
            <Label htmlFor="attr-slug">Slug</Label>
            <Input id="attr-slug" placeholder="e.g., facing-direction" />
          </div>
          <Button className="w-full btn-primary">Add Attribute</Button>
        </div>

        {/* Attributes List Table */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Existing Attributes
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Name
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Slug
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Terms
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttributes.map((attr) => (
                    <tr key={attr.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">
                        {attr.name}
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-xs">
                        {attr.slug}
                      </td>
                      <td className="p-4 text-gray-600">
                        {attr.terms.slice(0, 3).join(", ")}
                        {attr.terms.length > 3 ? "..." : ""}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Configure terms
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributesPage;
