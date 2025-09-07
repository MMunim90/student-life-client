import React, { useState, useRef } from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import Navbar from "../../sharedItem/Navbar";
import { useReactToPrint } from "react-to-print";
import { IoPrint } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ClassSchedule = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const componentRef = useRef(null);

  const [formData, setFormData] = useState({
    subject: "",
    subjectCode: "",
    roomNumber: "",
    day: "Sunday",
    time: "",
    instructor: "",
    colorCode: "#6B7280",
  });

  const [editData, setEditData] = useState(null);

  // GET schedules for the logged-in user
  const { data: schedules = [] } = useQuery({
    queryKey: ["schedules", user.email],
    queryFn: async () =>
      (await axiosSecure.get(`/schedules?email=${user.email}`)).data,
  });

  // CREATE
  const addMutation = useMutation({
    mutationFn: (newSchedule) =>
      axiosSecure.post("/schedules", { ...newSchedule, email: user.email }),
    onSuccess: () => queryClient.invalidateQueries(["schedules", user.email]),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, updated }) =>
      axiosSecure.patch(`/schedules/${id}`, { ...updated, email: user.email }),
    onSuccess: () => queryClient.invalidateQueries(["schedules", user.email]),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.delete(`/schedules/${id}?email=${user.email}`),
    onSuccess: () => queryClient.invalidateQueries(["schedules", user.email]),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (
      !formData.subject ||
      !formData.subjectCode ||
      !formData.roomNumber ||
      !formData.time ||
      !formData.instructor
    ) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }
    addMutation.mutate(formData);
    setFormData({
      subject: "",
      subjectCode: "",
      roomNumber: "",
      day: "Sunday",
      time: "",
      instructor: "",
      colorCode: "#6B7280",
    });
  };

  const handleUpdateClick = (cls) => {
    if (cls.email !== user.email) {
      Swal.fire("Error", "You cannot edit this schedule", "error");
      return;
    }
    setEditData({ ...cls });
  };

  const handleUpdateSubmit = () => {
    const {
      _id,
      subject,
      subjectCode,
      roomNumber,
      day,
      time,
      instructor,
      colorCode,
    } = editData;
    updateMutation.mutate({
      id: _id,
      updated: {
        subject,
        subjectCode,
        roomNumber,
        day,
        time,
        instructor,
        colorCode,
      },
    });
    setEditData(null);
  };

  const handleDelete = (cls) => {
    if (cls.email !== user.email) {
      Swal.fire("Error", "You cannot delete this schedule", "error");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "This schedule will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(cls._id);
        Swal.fire("Deleted!", "Schedule has been deleted.", "success");
      }
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Class Schedule",
  });

  return (
    <div className="py-24 w-11/12 mx-auto mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">📅 Class Schedule Tracker</h2>
        <button
          onClick={handlePrint}
          className="bg-[#2A4759] hover:bg-[#253b49] text-white px-8 py-2 rounded-md shadow flex items-center cursor-pointer justify-center"
        >
          <IoPrint size={25} />
        </button>
      </div>

      {/* Add Class Form */}
      <form
        onSubmit={handleAddClass}
        className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-10 p-4 border rounded-lg"
      >
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="subjectCode"
          value={formData.subjectCode}
          onChange={handleChange}
          placeholder="Subject Code"
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          placeholder="Room No."
          className="border rounded px-3 py-2"
        />
        <select
          name="day"
          value={formData.day}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          {days.map((d) => (
            <option className="text-black" key={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="e.g. 9:00 AM - 10:30 AM"
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          placeholder="Instructor"
          className="border rounded px-3 py-2"
        />
        <input
          type="color"
          name="colorCode"
          value={formData.colorCode}
          onChange={handleChange}
          className="h-10 w-full cursor-pointer"
        />
        <button
          type="submit"
          className="lg:col-span-7 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Add Class
        </button>
      </form>

      {/* Weekly Calendar */}
      <div
        ref={componentRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {days.map((day) => (
          <div key={day} className="border rounded-lg p-3 min-h-[200px]">
            <h3 className="font-semibold text-lg mb-2 text-center">{day}</h3>
            {schedules
              .filter((cls) => cls.day === day)
              .map((cls) => (
                <div
                  key={cls._id}
                  className="rounded-lg p-3 mb-2 shadow text-white"
                  style={{ backgroundColor: cls.colorCode }}
                >
                  <h4 className="font-bold">
                    {cls.subject} ({cls.subjectCode})
                  </h4>
                  <p className="text-sm">{cls.time}</p>
                  <p className="text-sm">Room: {cls.roomNumber}</p>
                  <p className="text-sm italic">Instructor: {cls.instructor}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <button
                      onClick={() => handleUpdateClick(cls)}
                      className="bg-yellow-500 px-2 py-1 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cls)}
                      className="bg-red-600 px-2 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 text-white">
            <h3 className="text-lg font-bold mb-4">Update Schedule</h3>
            <input
              type="text"
              name="subject"
              value={editData.subject}
              onChange={(e) =>
                setEditData({ ...editData, subject: e.target.value })
              }
              placeholder="Subject"
              className="border rounded px-3 py-2 mb-2 w-full"
            />
            <input
              type="text"
              name="subjectCode"
              value={editData.subjectCode}
              onChange={(e) =>
                setEditData({ ...editData, subjectCode: e.target.value })
              }
              placeholder="Subject Code"
              className="border rounded px-3 py-2 mb-2 w-full"
            />
            <input
              type="text"
              name="roomNumber"
              value={editData.roomNumber}
              onChange={(e) =>
                setEditData({ ...editData, roomNumber: e.target.value })
              }
              placeholder="Room No."
              className="border rounded px-3 py-2 mb-2 w-full"
            />
            <select
              name="day"
              value={editData.day}
              onChange={(e) =>
                setEditData({ ...editData, day: e.target.value })
              }
              className="border rounded px-3 py-2 mb-2 w-full"
            >
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <input
              type="text"
              name="time"
              value={editData.time}
              onChange={(e) =>
                setEditData({ ...editData, time: e.target.value })
              }
              placeholder="Time"
              className="border rounded px-3 py-2 mb-2 w-full"
            />
            <input
              type="text"
              name="instructor"
              value={editData.instructor}
              onChange={(e) =>
                setEditData({ ...editData, instructor: e.target.value })
              }
              placeholder="Instructor"
              className="border rounded px-3 py-2 mb-2 w-full"
            />
            <input
              type="color"
              name="colorCode"
              value={editData.colorCode}
              onChange={(e) =>
                setEditData({ ...editData, colorCode: e.target.value })
              }
              className="h-10 w-full mb-4 cursor-pointer"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditData(null)}
                className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 rounded text-white bg-[#2A4759] hover:bg-[#253b49]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <ThemeButton />
      <Navbar />
    </div>
  );
};

export default ClassSchedule;
