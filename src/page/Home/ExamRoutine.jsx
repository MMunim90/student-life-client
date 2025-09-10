import React, { useState, useEffect, useRef } from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import Navbar from "../../sharedItem/Navbar";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useReactToPrint } from "react-to-print";
import { IoPrint } from "react-icons/io5";

const ExamRoutine = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [routines, setRoutines] = useState([]);
  const [completedRoutines, setCompletedRoutines] = useState([]);
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    examDate: "",
    examTime: "",
    building: "",
    roomNumber: "",
  });
  const [editId, setEditId] = useState(null);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Exam Routine",
  });

  // Fetch routines and separate pending/completed
  const fetchRoutines = async () => {
    try {
      const res = await axiosSecure.get(`/exam-routines?email=${user?.email}`);
      const allRoutines = res.data;

      setRoutines(allRoutines.filter((r) => r.status !== "completed"));
      setCompletedRoutines(allRoutines.filter((r) => r.status === "completed"));
    } catch (error) {
      console.error("Failed to fetch routines", error);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchRoutines();
    }
  }, [user?.email]);

  // Form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosSecure.patch(`/exam-routines/${editId}`, {
          ...formData,
          email: user?.email,
        });
      } else {
        await axiosSecure.post("/exam-routines", {
          ...formData,
          email: user?.email,
          status: "pending",
        });
      }
      setFormData({
        courseName: "",
        courseCode: "",
        examDate: "",
        examTime: "",
        building: "",
        roomNumber: "",
      });
      setEditId(null);
      fetchRoutines();
    } catch (error) {
      console.error("Error saving routine", error);
    }
  };

  // Edit/Delete/Mark done
  const handleEdit = (routine) => {
    setFormData({
      courseName: routine.courseName,
      courseCode: routine.courseCode,
      examDate: routine.examDate,
      examTime: routine.examTime,
      building: routine.building,
      roomNumber: routine.roomNumber,
    });
    setEditId(routine._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/exam-routines/${id}`, {
        params: { email: user?.email },
      });
      fetchRoutines();
    } catch (error) {
      console.error("Failed to delete routine", error);
    }
  };

  const handleMarkDone = async (routine) => {
    try {
      await axiosSecure.patch(`/exam-routines/${routine._id}`, {
        ...routine,
        email: user?.email,
        status: "completed",
      });
      fetchRoutines();
    } catch (error) {
      console.error("Failed to mark exam as done", error);
    }
  };

  return (
    <div className="w-11/12 mx-auto min-h-screen mb-28 md:mb-6 mt-8 lg:mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">⏰ Exam Routine Manager</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl shadow mb-6"
      >
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={formData.courseName}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="courseCode"
          placeholder="Course Code"
          value={formData.courseCode}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="date"
          name="examDate"
          value={formData.examDate}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="time"
          name="examTime"
          value={formData.examTime}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="building"
          placeholder="Building"
          value={formData.building}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={formData.roomNumber}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="md:col-span-3 bg-[#2A4759] hover:bg-[#253b49] text-white py-2 px-4 rounded-lg transition cursor-pointer"
        >
          {editId ? "Update Routine" : "Add Routine"}
        </button>
      </form>

      {/* Tables + Print */}
      <div className="overflow-x-auto">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="mb-2 text-2xl">⏳ Upcoming Exams</h1>
          <button
            onClick={handlePrint}
            className="bg-[#2A4759] hover:bg-[#253b49] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <IoPrint size={20} /> Print Exam Routine
          </button>
        </div>

        {/* Printable Area */}
        <div ref={componentRef}>
          {/* Upcoming Exams */}
          <table className="w-full border-collapse border rounded-xl shadow">
            <thead>
              <tr className="bg-gray-400 text-left">
                <th className="p-3 border">Course Name</th>
                <th className="p-3 border">Course Code</th>
                <th className="p-3 border">Exam Date</th>
                <th className="p-3 border">Exam Time</th>
                <th className="p-3 border">Building</th>
                <th className="p-3 border">Room Number</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No routines added yet
                  </td>
                </tr>
              ) : (
                routines.map((routine) => (
                  <tr key={routine._id} className="hover:bg-gray-50 hover:text-black">
                    <td className="p-3 border">{routine.courseName}</td>
                    <td className="p-3 border">{routine.courseCode}</td>
                    <td className="p-3 border">{routine.examDate}</td>
                    <td className="p-3 border">{routine.examTime}</td>
                    <td className="p-3 border">{routine.building}</td>
                    <td className="p-3 border">{routine.roomNumber}</td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => handleEdit(routine)}
                        className="bg-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-500 transition cursor-pointer mb-2 md:mb-0 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(routine._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleMarkDone(routine)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition cursor-pointer"
                      >
                        Done
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Completed Exams */}
          <div className="overflow-x-auto mt-10">
            <h1 className="mb-2 text-2xl">✅ Completed Exams</h1>
            <table className="w-full border-collapse border rounded-xl shadow">
              <thead>
                <tr className="bg-gray-400 text-left">
                  <th className="p-3 border">Course Name</th>
                  <th className="p-3 border">Course Code</th>
                  <th className="p-3 border">Exam Date</th>
                  <th className="p-3 border">Exam Time</th>
                  <th className="p-3 border">Building</th>
                  <th className="p-3 border">Room Number</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedRoutines.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No completed exams
                    </td>
                  </tr>
                ) : (
                  completedRoutines.map((routine) => (
                    <tr key={routine._id} className="hover:bg-gray-50 hover:text-black">
                      <td className="p-3 border">{routine.courseName}</td>
                      <td className="p-3 border">{routine.courseCode}</td>
                      <td className="p-3 border">{routine.examDate}</td>
                      <td className="p-3 border">{routine.examTime}</td>
                      <td className="p-3 border">{routine.building}</td>
                      <td className="p-3 border">{routine.roomNumber}</td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => handleDelete(routine._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ThemeButton />
      <Navbar />
    </div>
  );
};

export default ExamRoutine;
