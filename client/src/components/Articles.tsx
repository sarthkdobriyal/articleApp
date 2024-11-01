import { Loader2 } from "lucide-react";
import { authClient } from "../utils/api-client";
import { useQuery } from "@tanstack/react-query";



const fetchArticles = async () => {
    const response = await authClient.get('/articles/list');
    return response.data;
  };

function Articles() {


    const { data: articles, isLoading, error } = useQuery({
        queryKey: ['articles'],
        queryFn: fetchArticles
      });


    
      if (isLoading) {
        return (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <p className="text-sm text-gray-500">Loading articles...</p>
            </div>
          </div>
        );
      }
    
      if (error) {
        return (
         <div>Error</div>
        );
      }
    



  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    
    { articles?.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-500">No articles found.</p>
      </div>
    ) : (
      <div className="space-y-6">
        {/* @ts-expect-error  working*/}
        {articles?.map((article) => (
          <article 
            key={article.id} 
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <header className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {article.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>By {article.author.name || article.author.email}</span>
                <span>•</span>
                <time dateTime={article.createdAt}>
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </header>
            
            <p className="text-gray-600 line-clamp-3">
              {article.content}
            </p>
            
           
          </article>
        ))}
      </div>
    )}
  </div>
  )
}

export default Articles