import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../sharedItem/Loading";
import ThemeButton from "../../sharedItem/ThemeButton";

const SkillProgressTracker = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [newSkill, setNewSkill] = useState("");
  const [goal, setGoal] = useState("");
  const [milestone, setMilestone] = useState("");

  // modal state
  const [editingSkill, setEditingSkill] = useState(null);
  const [editGoal, setEditGoal] = useState("");
  const [editMilestone, setEditMilestone] = useState("");

  // Fetch user-specific skill data
  const {
    data: skills = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["skills", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/skills?email=${user.email}`);
      return res.data;
    },
  });

  // Add skill with default status
  const handleAddSkill = async () => {
    if (!newSkill || !goal) return;
    const skillData = {
      email: user.email,
      skill: newSkill,
      goal,
      milestone,
      status: "in-progress",
    };
    await axiosSecure.post("/skills", skillData);
    setNewSkill("");
    setGoal("");
    setMilestone("");
    refetch();
  };

  // Mark skill as completed
  const handleComplete = async (id) => {
    await axiosSecure.patch(`/skills/${id}`, { status: "completed" });
    refetch();
  };

  // Open modal for editing
  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setEditGoal(skill.goal);
    setEditMilestone(skill.milestone || "");
  };

  // Save updates
  const handleUpdateSkill = async () => {
    if (!editingSkill) return;
    await axiosSecure.patch(`/skills/${editingSkill._id}`, {
      goal: editGoal,
      milestone: editMilestone,
    });
    setEditingSkill(null);
    setEditGoal("");
    setEditMilestone("");
    refetch();
  };

  // Delete a skill
  const handleDelete = async (id) => {
    await axiosSecure.delete(`/skills/${id}`);
    refetch();
  };

  if (isLoading)
    return (
      <div className="text-center mt-10">
        <Loading></Loading>
      </div>
    );

  return (
    <div className="w-11/12 mx-auto p-4 mt-8 lg:mt-20">
      <h1 className="text-3xl font-semibold mb-6 text-start">
        ⚡Skill Progress Tracker
      </h1>

      {/* Add Skill Form */}
      <div className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-medium mb-4">Add New Skill</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Skill (e.g., Coding)"
            className="border p-2 rounded w-full"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <input
            type="text"
            placeholder="Goal (short-term or long-term)"
            className="border p-2 rounded w-full"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <input
            type="text"
            placeholder="Milestone (optional)"
            className="border p-2 rounded w-full"
            value={milestone}
            onChange={(e) => setMilestone(e.target.value)}
          />
        </div>
        <button
          className="bg-[#2A4759] hover:bg-[#253b49] mt-4 text-white px-4 py-2 rounded w-full cursor-pointer"
          onClick={handleAddSkill}
        >
          Add Skill
        </button>
      </div>

      {/* Skill List */}
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="border p-4 rounded-lg flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{skill.skill}</h3>
              <p className="text-gray-500">Goal: {skill.goal}</p>
              {skill.milestone && (
                <p className="text-gray-500">Milestone: {skill.milestone}</p>
              )}
              <p
                className={`mt-2 ${
                  skill.status === "completed"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                Status: {skill.status || "in-progress"}
              </p>
            </div>

            <div className="flex gap-4 mt-2 self-end">
              {skill.status !== "completed" && (
                <button
                  onClick={() => handleComplete(skill._id)}
                  className="text-green-500 cursor-pointer"
                >
                  Mark Completed
                </button>
              )}
              <button
                onClick={() => openEditModal(skill)}
                className="text-blue-500 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(skill._id)}
                className="text-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-auto mx-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Skill</h2>
            <input
              type="text"
              className="border p-2 rounded w-full mb-3"
              placeholder="Goal"
              value={editGoal}
              onChange={(e) => setEditGoal(e.target.value)}
            />
            <input
              type="text"
              className="border p-2 rounded w-full mb-3"
              placeholder="Milestone"
              value={editMilestone}
              onChange={(e) => setEditMilestone(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingSkill(null)}
                className="text-gray-500 hover:text-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSkill}
                className="bg-[#2A4759] hover:bg-[#253b49] text-white px-4 py-2 rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ThemeButton></ThemeButton>
    </div>
  );
};

export default SkillProgressTracker;