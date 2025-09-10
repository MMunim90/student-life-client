import React, { useState, useEffect } from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import Navbar from "../../sharedItem/Navbar";
import { format, isBefore, addDays, compareAsc, compareDesc } from "date-fns";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Lottie from "lottie-react";
import celebrateAnimation from "../../assets/lottie/Celebration.json";

const StudyPlanner = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [hour, setHour] = useState("");
  const [timers, setTimers] = useState({});
  const [runningTimers, setRunningTimers] = useState({});
  const [celebrate, setCelebrate] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDeadline, setEditDeadline] = useState("");
  const [editHour, setEditHour] = useState("");

  // Handle Timer Start
  const handleStartTimer = (taskId, hours) => {
    const totalMs = hours * 60 * 60 * 1000; // convert hour → ms
    if (!timers[taskId]) {
      setTimers((prev) => ({ ...prev, [taskId]: totalMs }));
    }
    setRunningTimers((prev) => ({ ...prev, [taskId]: true }));
  };

  // Handle Pause
  const handlePauseTimer = (taskId) => {
    setRunningTimers((prev) => ({ ...prev, [taskId]: false }));
  };

  // Handle Reset
  const handleResetTimer = (taskId, hours) => {
    const totalMs = hours * 60 * 60 * 1000;
    setTimers((prev) => ({ ...prev, [taskId]: totalMs }));
    setRunningTimers((prev) => ({ ...prev, [taskId]: false }));
  };

  // Effect to decrease running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updated = { ...prevTimers };
        Object.keys(runningTimers).forEach((taskId) => {
          if (runningTimers[taskId] && updated[taskId] > 0) {
            updated[taskId] = updated[taskId] - 1000; // decrease 1 sec
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [runningTimers]);

  // Fetch tasks from backend
  useEffect(() => {
    if (!user?.email) return;

    const fetchTasks = async () => {
      try {
        const res = await axiosSecure.get(`/tasks?email=${user.email}`);
        const active = res.data.filter((t) => !t.isCompleted);
        const completed = res.data.filter((t) => t.isCompleted);
        setTasks(active);
        setCompletedTasks(completed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [user, axiosSecure]);

  // Add Task → POST
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!subject || !deadline) return;

    const newTask = {
      subject,
      priority,
      deadline,
      hour,
      isCompleted: false,
      email: user.email,
    };

    try {
      const res = await axiosSecure.post("/tasks", newTask);
      if (res.data.insertedId) {
        setTasks([...tasks, { ...newTask, _id: res.data.insertedId }]);
      }
    } catch (err) {
      console.error(err);
    }

    setSubject("");
    setPriority("Medium");
    setDeadline("");
  };

  // Toggle Completed → PATCH
  const handleToggleComplete = async (task) => {
    try {
      const res = await axiosSecure.patch(`/tasks/${task._id}`, {
        isCompleted: !task.isCompleted,
      });

      if (res.data.modifiedCount > 0) {
        if (!task.isCompleted) {
          // Show celebration animation
          setCelebrate(true);
          setTimeout(() => setCelebrate(false), 3000);

          // Move to completed
          setTasks(tasks.filter((t) => t._id !== task._id));
          setCompletedTasks([
            ...completedTasks,
            { ...task, isCompleted: true },
          ]);
        } else {
          // Move back to active
          setCompletedTasks(completedTasks.filter((t) => t._id !== task._id));
          setTasks([...tasks, { ...task, isCompleted: false }]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task → DELETE
  const handleDelete = async (id, type = "active") => {
    try {
      const res = await axiosSecure.delete(`/tasks/${id}`);
      if (res.data.deletedCount > 0) {
        if (type === "active") {
          setTasks(tasks.filter((task) => task._id !== id));
        } else {
          setCompletedTasks(completedTasks.filter((task) => task._id !== id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    const updatedTask = {
      subject: editSubject,
      priority: editPriority,
      deadline: editDeadline,
      hour: editHour,
    };

    try {
      const res = await axiosSecure.patch(
        `/tasks/${editingTask._id}`,
        updatedTask
      );
      if (res.data.modifiedCount > 0) {
        // Update active tasks state
        setTasks(
          tasks.map((t) =>
            t._id === editingTask._id ? { ...t, ...updatedTask } : t
          )
        );
        setEditingTask(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Priority Color
  const getPriorityColor = (level) => {
    if (level === "High") return "text-red-600 font-semibold";
    if (level === "Medium") return "text-orange-500 font-semibold";
    return "text-green-600 font-semibold";
  };

  // Deadline Highlight
  const isDeadlineClose = (date) => {
    const today = new Date();
    const taskDate = new Date(date);
    return isBefore(taskDate, addDays(today, 2));
  };

  // Filter + Sort
  const filteredAndSortedTasks = tasks
    .filter((task) =>
      filterPriority === "All" ? true : task.priority === filterPriority
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return compareAsc(new Date(a.deadline), new Date(b.deadline));
      } else {
        return compareDesc(new Date(a.deadline), new Date(b.deadline));
      }
    });

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditSubject(task.subject);
    setEditPriority(task.priority);
    setEditDeadline(task.deadline);
    setEditHour(task.hour);
  };

  return (
    <div className="min-h-screen mb-28 md:mb-6 mt-8 lg:mt-20">
      <div className="w-11/12 mx-auto px-6 py-8">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-3xl font-bold">📚 Study Planner</h1>
          <p className="md:ml-12 mt-1">Plan smart, study better</p>
        </div>

        {/* Task Input Form */}
        <form
          onSubmit={handleAddTask}
          className="border rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <input
            type="text"
            placeholder="Enter Subject/Topic"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <select
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option className="text-black">High</option>
            <option className="text-black">Medium</option>
            <option className="text-black">Low</option>
          </select>

          <input
            type="number"
            placeholder="Enter Hours"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          />

          <input
            type="date"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#2A4759] hover:bg-[#253b49] text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Add Task
          </button>
        </form>

        {/* Filter & Sort Options */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-3 items-center">
            <label className="font-medium">Filter:</label>
            <select
              className="border rounded-lg px-3 py-2 cursor-pointer"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option className="text-black">All</option>
              <option className="text-black">High</option>
              <option className="text-black">Medium</option>
              <option className="text-black">Low</option>
            </select>
          </div>
          <div className="flex gap-3 items-center">
            <label className="font-medium">Sort by Deadline:</label>
            <select
              className="border rounded-lg px-3 py-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option className="text-black" value="asc">
                Earliest First
              </option>
              <option className="text-black" value="desc">
                Latest First
              </option>
            </select>
          </div>
        </div>

        {/* Active Task List */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Active Tasks</h2>
          {filteredAndSortedTasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedTasks.map((task) => (
                <div
                  key={task._id}
                  className="border transition rounded-xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                >
                  {/* Task Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{task.subject}</h3>
                    <p className={getPriorityColor(task.priority)}>
                      Priority: {task.priority}
                    </p>
                    <p
                      className={`text-sm ${
                        isDeadlineClose(task.deadline)
                          ? "text-red-600 font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      Deadline: {format(new Date(task.deadline), "PPP")}
                    </p>
                  </div>

                  {/* Stopwatch Section */}
                  <div className="flex flex-col items-start md:items-center mb-4 mr-4">
                    {timers[task._id] !== undefined ? (
                      <p className="text-sm text-blue-600">
                        ⏱ {Math.floor(timers[task._id] / 3600000)}h :
                        {Math.floor((timers[task._id] % 3600000) / 60000)}m :
                        {Math.floor((timers[task._id] % 60000) / 1000)}s
                      </p>
                    ) : (
                      <p className="text-xl text-gray-500">⏱ {task.hour}h</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => handleStartTimer(task._id, task.hour)}
                        className="px-2 py-1 bg-green-500 text-white rounded text-sm cursor-pointer"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => handlePauseTimer(task._id)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded text-sm cursor-pointer"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => handleResetTimer(task._id, task.hour)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Actions (checkbox + delete) */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleComplete(task)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-blue-500 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id, "active")}
                      className="text-red-500 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Task List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500">No completed tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-green-200 border border-green-200 rounded-xl p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium line-through text-gray-600">
                      {task.subject}
                    </h3>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                  <button
                    onClick={() => handleDelete(task._id, "completed")}
                    className="text-red-500 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* update task */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

            <input
              type="text"
              className="border p-2 rounded w-full mb-3"
              placeholder="Subject"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
            />
            <select
              className="border p-2 rounded w-full mb-3"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option className="text-black">High</option>
              <option className="text-black">Medium</option>
              <option className="text-black">Low</option>
            </select>
            <input
              type="date"
              className="border p-2 rounded w-full mb-3"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
            />
            <input
              type="number"
              className="border p-2 rounded w-full mb-3"
              value={editHour}
              onChange={(e) => setEditHour(e.target.value)}
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-400 hover:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="bg-[#2A4759] hover:bg-[#253b49] text-white px-4 py-2 rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {celebrate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-full h-auto">
            <Lottie animationData={celebrateAnimation} loop={false} />
          </div>
        </div>
      )}

      <ThemeButton></ThemeButton>
      <Navbar></Navbar>
    </div>
  );
};

export default StudyPlanner;
