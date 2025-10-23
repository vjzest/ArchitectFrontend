import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, PlusCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchAllPostsAdmin,
  deletePost,
  resetBlogActionStatus,
  BlogPost,
} from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { toast } from "sonner";
import { BlogFormModal } from "@/components/BlogFormModal";

const AdminBlogsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  // ✅ SAHI SYNTAX YAHAN HAI: `from` ki jagah `=` ka istemal karein
  const { posts, status, actionStatus, error } = useSelector(
    (state: RootState) => state.blog
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllPostsAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetBlogActionStatus());
      if (isModalOpen) setIsModalOpen(false);
      if (isAlertOpen) setIsAlertOpen(false);
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Action failed.");
      dispatch(resetBlogActionStatus());
    }
  }, [actionStatus, error, dispatch, isModalOpen, isAlertOpen]);

  const handleEditClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPostId) {
      dispatch(deletePost(selectedPostId));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Blog Posts
          </h1>
          <p className="text-gray-600">
            Create, edit, and delete blog articles.
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Post
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "Published" ? "default" : "secondary"
                      }
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={() => handleEditClick(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(post._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No blog posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPostId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BlogFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      />
    </div>
  );
};

export default AdminBlogsPage;
