import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const FoodPartnerProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg px-5">
        <div className="flex items-center gap-7 px-2 py-6">
          <div className="w-16 h-16 rounded-full border border-gray-600 bg-gray-700 overflow-hidden">
            <img src="https://img.freepik.com/free-vector/young-man-with-blue-eyes_1308-174369.jpg?t=st=1759250276~exp=1759253876~hmac=da817cc417d59c2daa9365f5bfd95513671dd90b8c0e2a43f1eb512368e389e0&w=1060" alt="" className="object-cover"/>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-gray-700 border border-gray-600 p-2 rounded-lg">
              <h2 className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                {profile?.name}
              </h2>
            </div>
            <div className="mt-1">
              <div className="bg-gray-700 border border-gray-600 p-2 rounded-lg inline">
                <div className="text-gray-900 dark:text-gray-100 inline">
                  {profile?.address}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-around py-8 border-t">
          <div className="text-center">
            <p className="text-gray-400">Total Meals</p>
            <h2 className="text-xl font-medium mt-2">{videos?.length}</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Customer Serve</p>
            <h2 className="text-xl font-medium mt-2">43K</h2>
          </div>
        </div>
        <div className="text-center pb-6">
          <Link to={'/create-food'} className="bg-gray-900/40 border py-2 px-4 rounded">Create Food</Link>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-6 mt-6">
        <div className="text-xl font-medium mb-4">All Food Items</div>
        {videos.length == 0 && (
          <div className="text-center border border-gray-600 rounded">
            <div className="text-lg text-gray-300 font-medium py-4">
              You haven't add any Food
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          {videos.map((item) => (
            <div
              key={item._id}
              className="bg-gray-700 border border-gray-600 rounded min-h-28 flex items-center justify-center"
            >
              <video src={item.video}></video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerProfile;
