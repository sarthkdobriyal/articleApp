import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../utils/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateArticleRequest,
  createArticleSchema,
} from "../utils/validations";
import { Loader2 } from "lucide-react";

interface AddArticleModalProps {
  closeModal: () => void;
}

const AddArticleModal: React.FC<AddArticleModalProps> = ({ closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateArticleRequest>({
    resolver: zodResolver(createArticleSchema),
  });

  const queryClient = useQueryClient();

  const onSubmit = async (data: CreateArticleRequest) => {
    try {
      await authClient.post("/articles/create", data);
      toast.success("Article created successfully!");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create article");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Article
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                {...register("title")}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter article title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                {...register("content")}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your article content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Article"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddArticleModal;


