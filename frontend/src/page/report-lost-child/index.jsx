import { useState, useCallback } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Banner from './Banner.jpg';
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";

const ReportLostChild = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    try {
      setIsLoading(true);
      await api.post("/report-lost-child", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsSubmitted(true);
      setMessage("Submitted successfully");
    } catch (error) {
      setMessage("Something went wrong while uploading form data. See console");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const Modal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        {isLoading ? (
          <>
            <ImSpinner2 className="animate-spin text-accent-500 text-4xl mx-auto mb-4" />
            <p className="text-lg font-semibold">Submitting your report...</p>
          </>
        ) : (
          <>
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <p className="text-lg font-semibold">Your report has been submitted!</p>
            <p className="text-lg font-semibold">Our team will contact you with the updates</p>
            <button
              className="mt-6 rounded bg-accent-500 px-6 py-3 text-white font-semibold hover:bg-accent-600 transition"
              onClick={() => navigate("/")}
            >
              Go back to home page
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-12"
      style={{
        backgroundImage: `url(${Banner})`,
      }}
    >
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg border border-gray-300">
        <h2 className="mb-6 text-center text-3xl font-bold text-accent-900">
          Report a Lost Child
        </h2>
        <p className="mb-8 text-center text-accent-600">
          If you have information about a missing child, please fill out the form
          below to report it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label
              htmlFor="fullname"
              className="block text-lg font-semibold text-accent-800"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="w-full rounded border border-gray-300 p-3 mt-2 focus:border-accent-400 focus:ring-accent-400"
              required
            />
          </div>

          {/* Age */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label htmlFor="age" className="block text-lg font-semibold text-accent-800">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              step="0.1"
              className="w-full rounded border border-gray-300 p-3 mt-2 focus:border-accent-400 focus:ring-accent-400"
              required
            />
          </div>

          {/* Gender */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label htmlFor="gender" className="block text-lg font-semibold text-accent-800">
              Gender
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  className="text-accent-400 focus:ring-accent-400"
                  required
                />
                <span className="ml-2 text-accent-800">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="text-accent-400 focus:ring-accent-400"
                  required
                />
                <span className="ml-2 text-accent-800">Female</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  className="text-accent-400 focus:ring-accent-400"
                  required
                />
                <span className="ml-2 text-accent-800">Other</span>
              </label>
            </div>
          </div>

          {/* Appearance Description */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label
              htmlFor="describe_appearance"
              className="block text-lg font-semibold text-accent-800"
            >
              Appearance Description
            </label>
            <textarea
              id="describe_appearance"
              name="describe_appearance"
              className="w-full rounded border border-gray-300 p-3 mt-2 focus:border-accent-400 focus:ring-accent-400"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Last Seen Location */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label
              htmlFor="last_seen_location"
              className="block text-lg font-semibold text-accent-800"
            >
              Last Seen Location
            </label>
            <input
              type="text"
              id="last_seen_location"
              name="last_seen_location"
              className="w-full rounded border border-gray-300 p-3 mt-2 focus:border-accent-400 focus:ring-accent-400"
              required
            />
          </div>

          {/* Follow-up Contact Name */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label
              htmlFor="follow_up_name"
              className="block text-lg font-semibold text-accent-800"
            >
              Follow-up Contact Name
            </label>
            <input
              type="text"
              id="follow_up_name"
              name="follow_up_name"
              className="w-full rounded border border-gray-300 p-3 mt-2 focus:border-accent-400 focus:ring-accent-400"
              required
            />
          </div>

          {/* Follow-up Contact Phone */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label
              htmlFor="follow_up_phone"
              className="block text-lg font-semibold text-accent-800"
            >
              Follow-up Contact Phone
            </label>
            <input
              type="tel"
              id="follow_up_phone"
              name="follow_up_phone"
              className="w-full rounded border border-gray-300 p-3 mt-2 focus:border-accent-400 focus:ring-accent-400"
              required
            />
          </div>

          {/* File Upload */}
          <div className="rounded-lg bg-accent-50 p-4 shadow-sm">
            <label
              htmlFor="file"
              className="block text-lg font-semibold text-accent-800"
            >
              Upload Child&apos;s Photo
            </label>
            <input
              type="file"
              id="file"
              name="file"
              className="w-full rounded border border-gray-300 p-3 mt-2 focus:border-accent-400 focus:ring-accent-400"
              accept="image/*"
              required
            />
          </div>

          {message && <p className="text-center text-brand-600 font-semibold">{message}</p>}

          <button
            type="submit"
            className="w-full rounded bg-accent-500 px-6 py-3 text-white font-semibold hover:bg-accent-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit Report"}
          </button>
        </form>
      </div>

      {/* Show modal only if isLoading or isSubmitted is true */}
      {(isLoading || isSubmitted) && <Modal />}
    </div>
  );
};

export default ReportLostChild;
