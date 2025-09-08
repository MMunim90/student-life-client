import React, { useState, useEffect } from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import Navbar from "../../sharedItem/Navbar";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const BudgetTracker = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
  });

  // Fetch transactions from backend
  useEffect(() => {
    if (!user?.email) return;
    axiosSecure
      .get(`/transactions/${user.email}`)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, [user?.email, axiosSecure]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transaction = {
      ...formData,
      email: user.email,
      amount: Number(formData.amount),
      date: new Date(),
    };
    try {
      const res = await axiosSecure.post("/transactions", transaction);
      setTransactions([...transactions, res.data]); // backend returns full doc
      setFormData({ type: "income", category: "", amount: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const savings = totalIncome - totalExpense;

  // ----- Chart Data -----
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .map((t) => ({ name: t.category, value: t.amount }));

  const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

  const incomeData = transactions
    .filter((t) => t.type === "income")
    .map((t, index) => ({
      category: t.category,
      amount: t.amount,
      fill: COLORS[index % COLORS.length],
    }));

  return (
    <div className="min-h-screen mb-20 md:mb-6">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-6">💰 Budget Tracker</h2>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-200 p-4 rounded-2xl text-center">
            <p className="text-gray-500">Total Income</p>
            <p className="text-xl font-bold text-green-700">৳ {totalIncome}</p>
          </div>
          <div className="bg-red-200 p-4 rounded-2xl text-center">
            <p className="text-gray-500">Total Expense</p>
            <p className="text-xl font-bold text-red-700">৳ {totalExpense}</p>
          </div>
          <div className="bg-blue-200 p-4 rounded-2xl text-center">
            <p className="text-gray-500">Savings</p>
            <p className="text-xl font-bold text-blue-700">৳ {savings}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Income Bar Chart */}
          <div className="border p-6 px-2 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Income by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart className="text-black" data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount">
                  {incomeData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Pie Chart */}
          <div className="border p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Expense Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {expenseData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="border p-6 rounded-2xl shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full sm:w-40"
            >
              <option className="text-black" value="income">
                Income
              </option>
              <option className="text-black" value="expense">
                Expense
              </option>
            </select>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border rounded-lg p-2 flex-1"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full sm:w-40"
              required
            />
            <button
              type="submit"
              className="bg-[#2A4759] hover:bg-[#253b49] text-white px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        {/* Transaction List */}
        <div className="border p-6 rounded-2xl shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-2">Type</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id} className="border-t hover:bg-gray-50">
                      <td
                        className={`p-2 font-medium ${
                          t.type === "income"
                            ? "text-green-600"
                            : "text-yellow-500"
                        }`}
                      >
                        {t.type}
                      </td>
                      <td className="p-2">{t.category}</td>
                      <td className="p-2">৳ {t.amount}</td>
                      <td className="p-2">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ThemeButton />
        <Navbar />
      </div>
    </div>
  );
};

export default BudgetTracker;
