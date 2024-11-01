import { useQuery } from "@tanstack/react-query";
import { authClient } from "../utils/api-client";
import { Loader2 } from "lucide-react";


const fetchCredits = async () => {
    const response = await authClient.get('/articles/getCredits');
    return response.data;
  };


function Credits() {

    const { data: credits, isLoading, error } = useQuery({
        queryKey: ['credits'],
        queryFn: fetchCredits
      });

      console.log(credits)

      if(isLoading) return <Loader2 className="animate-spin" />
      if(error) return <span className="text-red-500">
        Error
      </span>



  return (
    <div className="flex items-center gap-x-2 font-bold  text-sm">
        <span>Credits: </span>
        <span>{credits[0].credits} / 10 </span>
    </div>
  )
}

export default Credits