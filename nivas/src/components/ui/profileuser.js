import { useEffect, useState } from "react";

export default function UserProfileCard() {
  const DEFAULT_USER = {
    username: "Saravanesh",
    email: "saravanesh@email.com",
    joined: "January 2025",
    district: "Madurai",
    reputation: 128,
    image: null,
  };

  const [user, setUser] = useState(DEFAULT_USER);

  let token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return; // if no token → keep default

    fetch("https://quiz.selfmade.express/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        // fallback to default automatically
      });
  }, []);

  const DEFAULT_AVATAR =
    "https://i.pinimg.com/474x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg?nii=t";

  const imageSrc = user.image
    ? `data:image/jpeg;base64,${user.image}`
    : DEFAULT_AVATAR;

  return (
    <section className="border border-gray-300 shadow-md rounded-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
      <div className="flex items-center space-x-6">
        <img
          src={imageSrc}
          alt={`Portrait of ${user.username}`}
          className="w-20 h-20 rounded-full object-cover"
          width={80}
          height={80}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />

        <div>
          <h2 className="font-semibold text-gray-900 text-xl leading-tight">
            {user.username}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Joined {user.joined} • {user.district}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-10">
        <div className="text-right">
          <p className="text-black font-semibold text-base flex items-center justify-end space-x-2">
            <span className="text-lg">{user.reputation}</span>
            ⭐
          </p>
          <p className="text-gray-400 text-sm">Reputation</p>
        </div>

        <button
          type="button"
          className="border border-black text-black text-sm rounded px-4 py-2 hover:bg-black hover:text-white transition"
        >
          Change Image
        </button>
      </div>
    </section>
  );
}