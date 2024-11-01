import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout, user } = useAuth();
  return (
    <nav className="bg-gray-800 p-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
        Article App
      </div>
      <div className="flex flex-col sm:flex-row items-center">
        {user && (
          <>
            <span className="text-white text-sm sm:text-base mr-0 sm:mr-4 mb-2 sm:mb-0">
              {user.name} ({user.email})
            </span>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
