import React, { useEffect, useState } from "react";
import { FaUsers, FaSearch, FaChartLine, FaCalendarAlt, FaShieldAlt, FaEye } from "react-icons/fa";
import { FiAlertTriangle, FiMapPin, FiVideo } from "react-icons/fi";
import banner from "./banner.jpg";
import banner2 from "./banner2.jpg";
import SOSButton from "@/components/SOS";
import { useAppContext } from "@/context/app-provider";

function HomePage() {
  const [daysToGo, setDaysToGo] = useState(0);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    const eventDate = new Date("January 15, 2025");
    const today = new Date();
    const timeDiff = eventDate - today;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setDaysToGo(days);
  }, []);

  return (
    <div>
      <div
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center">
          <div className="container mx-auto px-6">
            <div className="flex items-center">
              <div className="w-1 bg-brand-500 h-20 mr-4"></div>

              <div>
                <div className="text-[#FFF500] text-xl font-semibold">
                {daysToGo} days to go
                </div>
                <h1 className="text-white text-5xl font-bold">
                  MAHA KUMBH MELA <span className="text-brand-500">2024</span>
                </h1>
                <div className="flex items-center text-white mt-4 text-lg">
                  <FaCalendarAlt className="mr-2" />
                  <span>15 January – 28 February</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Feature Section */}
      <section className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaShieldAlt className="text-brand-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Weapon Detection</h2>
          <p className="text-lg text-gray-700">AI-powered detection of weapons to ensure safety.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaSearch className="text-brand-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Facial Recognition</h2>
          <p className="text-lg text-gray-700">
            Lost people found through advanced facial recognition technology.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FiVideo className="text-brand-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Real-time Surveillance</h2>
          <p className="text-lg text-gray-700">Live video monitoring for crowd management.</p>
        </div>
      </section>

      {/* Live Updates Section */}
      <section className="mt-12 bg-accent-50 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-accent-700 mb-6">Real-time Crowd Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <FaUsers className="text-accent-500 text-5xl mr-4" />
            <div>
              <h3 className="text-2xl font-semibold mb-1">Current Crowd Density</h3>
              <p className="text-lg text-gray-600">Over 500,000 people present at the event right now.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <FiAlertTriangle className="text-accent-500 text-5xl mr-4" />
            <div>
              <h3 className="text-2xl font-semibold mb-1">Emergency Alert</h3>
              <p className="text-lg text-gray-600">Sector 12 blocked due to heavy crowd. Avoid the area.</p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="relative my-10 bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${banner2})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center">
          <div className="container mx-auto px-6">
            <div className="flex items-center">
              <div className="w-1 bg-brand-500 h-20 mr-4"></div>

              <div>
                
                <h1 className="text-white text-5xl font-bold">
                  SURAKSHIT MAHA KUMBH
                </h1>
                <div className="flex items-center text-white mt-4 text-lg">
                  <span>Embark on a journey of divine harmony at Maha Kumbh Mela 2025, where your safety is our utmost priority. Experience the serenity of a Surakshit Maha Kumbh, ensuring a secure and protected pilgrimage for every soul.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Measures Section */}
      <section className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaEye className="text-brand-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">AI Surveillance</h2>
          <p className="text-lg text-gray-700">Ensure safety through continuous surveillance.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaSearch className="text-brand-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Lost & Found</h2>
          <p className="text-lg text-gray-700">Real-time reporting and finding lost individuals.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FiMapPin className="text-brand-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Emergency Maps</h2>
          <p className="text-lg text-gray-700">Quick access to emergency exits and routes.</p>
        </div>
      </section>

      {!isAuthenticated && <SOSButton/>}
    </div>
  );
}

export default HomePage;
