import { useEffect, useState } from "react";

export default function UserProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/1")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  if (!user) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  return (
    <section className="border border-gray-300 shadow-md rounded-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
      <div className="flex items-center space-x-6">
        <img
          src={user.image}
          alt={`Portrait of ${user.name}`}
          className="w-20 h-20 rounded-full object-cover"
          width={80}
          height={80}
        />
        <div>
          <h2 className="font-semibold text-gray-900 text-xl leading-tight">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500 leading-tight">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1 flex items-center space-x-1">
            <span>Joined {user.joined}</span>
            <i className="fas fa-circle text-[6px] text-gray-400" />
            <span className="flex items-center space-x-1">
              <i className="fas fa-map-marker-alt text-gray-400 text-sm" />
              <span>{user.location}</span>
            </span>
          </p>
        </div>
      </div>

      
      <div className="flex items-center space-x-10">
        <div className="text-right">
          <p className="text-black font-semibold text-base flex items-center justify-end space-x-2">
            <span className="text-lg">{user.reputation}</span>
            <i className="fas fa-star text-yellow-500 text-xl" />
          </p>
          <p className="text-gray-400 text-sm">Reputation</p>
        </div>
        <button
          type="button"
          className="border border-black text-black text-sm rounded px-4 py-2 hover:bg-black hover:text-white focus:outline-none"
        >
          Edit Profile
        </button>
      </div>
    </section>
  );
}
