
import Articles from "../components/Articles"
import Navbar from "../components/Navbar"
import { useState } from "react";
import AddArticleModal from "../components/AddArticleModal";
import Credits from "../components/Credits";

function Dashboard() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="w-full h-full">
      <Navbar />

      <div className="max-w-7xl w-full  mx-auto my-5">
        <div className="flex justify-between px-10">
          <span className="text-3xl font-bold">Articles</span>
          <div className="flex gap-x-3">

            <Credits />
          <button
          className='bg-blue-600 text-white h-fit py-2  px-4 rounded-xl hover:bg-blue-700'
          onClick={openModal}
          >
          Add Article
        </button>
          </div>
        </div>
      <Articles />
      </div>

      {isModalOpen && <AddArticleModal closeModal={closeModal} />}

      
    </div>
  )
}

export default Dashboard