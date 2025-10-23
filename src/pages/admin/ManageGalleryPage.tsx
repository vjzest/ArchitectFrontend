import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchGalleryItems,
  deleteGalleryItem,
  resetActionStatus,
  GalleryItem,
} from "@/lib/features/gallery/gallerySlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2, ServerCrash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GalleryCard = ({
  item,
  onDelete,
}: {
  item: GalleryItem;
  onDelete: (id: string) => void;
}) => {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0">
        <div className="aspect-w-16 aspect-h-9">
          <img
            // FIX: Changed src from item.secure_url to item.imageUrl
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardContent>
      <CardHeader className="p-4">
        <CardTitle className="text-base truncate">{item.title}</CardTitle>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{item.category}</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                image from the gallery and from the servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(item._id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

const ManageGalleryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, status, actionStatus, error } = useSelector(
    (state: RootState) => state.gallery
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGalleryItems());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // This effect handles notifications for create/delete actions
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully.");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "The action has failed.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, dispatch, error]);

  const handleDelete = (id: string) => {
    dispatch(deleteGalleryItem(id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Gallery</h1>
        <Link to="/admin/gallery/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Image
          </Button>
        </Link>
      </div>

      {status === "loading" && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {status === "failed" && (
        <div className="text-center py-20 bg-red-50 rounded-lg">
          <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-xl font-semibold text-red-600">
            Error Loading Gallery
          </h3>
          <p className="mt-2 text-red-500">{String(error)}</p>
        </div>
      )}

      {status === "succeeded" && items.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">The Gallery is Empty</h3>
          <p className="mt-2 text-muted-foreground">
            Start by adding your first image.
          </p>
        </div>
      )}

      {status === "succeeded" && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item) => (
            <GalleryCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGalleryPage;
