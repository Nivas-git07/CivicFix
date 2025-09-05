import { useEffect, useState } from "react";
import "../image/default.jpg";

export default function UserProfileCard() {
    const [user, setUser] = useState(null);
    let token = localStorage.getItem("token");
    console.log(token);


    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:5000/api/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched user:", data); 
                setUser(data);
            })
            .catch((err) => console.error("Error fetching user:", err));
    }, []);

    if (!user) {
        return <p className="text-gray-500">Loading profile...</p>;
    }
    const DEFAULT_AVATAR = "../image/default.jpg";
    const imageSrc = user.image
        ? `data:image/jpeg;base64,${user.image}`
        : DEFAULT_AVATAR;

    return (
        <section className="border border-gray-300 shadow-md rounded-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
            <div className="flex items-center space-x-6">
                <img
                    src={imageSrc}
                    alt={`Portrait of ${user.name}`}
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
                    <p className="text-sm text-gray-500 leading-tight">{user.email}</p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center space-x-1">
                        <span>Joined {user.joined}</span>
                        <i className="fas fa-circle text-[6px] text-gray-400" />
                        <span className="flex items-center space-x-1">
                            <i className="fas fa-map-marker-alt text-gray-400 text-sm" />
                            <span>{user.district}</span>
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
                    onClick={() => document.getElementById("profileImageInput").click()}
                    className="border border-black text-black text-sm rounded px-4 py-2 hover:bg-black hover:text-white focus:outline-none"
                >
                    Change Image
                </button>

                <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("image", file);

                        try {
                            const res = await fetch("http://localhost:5000/api/profile/image", {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                                body: formData,
                            });

                            const data = await res.json();
                            if (res.ok) {
                                console.log("✅ Image uploaded:", data);
                                setUser((prev) => ({ ...prev, image: data.image }));
                            } else {
                                console.error("❌ Upload failed:", data.error);
                            }
                        } catch (err) {
                            console.error("❌ Error uploading image:", err);
                        }
                    }}
                />
            </div>
        </section>
    );
}
