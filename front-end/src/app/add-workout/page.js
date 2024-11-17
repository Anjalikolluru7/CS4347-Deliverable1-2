"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./workouts.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WorkoutTracking() {
  const router = useRouter();

  const [workouts, setWorkouts] = useState([
    { type: "Running", duration: "30 mins", frequency: "Daily", intensity: "Moderate", date: "2024-11-14" },
    { type: "Yoga", duration: "45 mins", frequency: "Weekly", intensity: "Low", date: "2024-11-13" },
    { type: "Cycling", duration: "20 mins", frequency: "Weekly", intensity: "High", date: "2024-11-12" },
  ]);
  const [form, setForm] = useState({ type: "", duration: "", frequency: "", intensity: "", date: "", });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [filter, setFilter] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddWorkout = () => {
    if (!form.type || !form.duration || !form.frequency || !form.intensity) {
      alert("Please fill out all fields.");
      return;
    }
    if (isEditing) {
      const updatedWorkouts = [...workouts];
      updatedWorkouts[currentEditIndex] = form;
      setWorkouts(updatedWorkouts);
      setIsEditing(false);
      setCurrentEditIndex(null);
    } else {
      setWorkouts([...workouts, form]);
    }
    setForm({ type: "", duration: "", frequency: "", intensity: "" });
  };

  const handleEditWorkout = (index) => {
    setForm(workouts[index]);
    setIsEditing(true);
    setCurrentEditIndex(index);
  };

  const handleDeleteWorkout = (index) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);
  };

  const filteredWorkouts = filter
    ? workouts.filter((workout) =>
        workout.type.toLowerCase().includes(filter.toLowerCase()) ||
        workout.intensity.toLowerCase().includes(filter.toLowerCase())
      )
    : workouts;


    const groupedWorkouts = workouts.reduce((acc, workout) => {
      const date = workout.date;
      const duration = parseInt(workout.duration, 10);
  
      // If the date already exists in the accumulator, add the duration
      if (acc[date]) {
        acc[date] += duration;
      } else {
        // If the date doesn't exist, initialize it with the current workout duration
        acc[date] = duration;
      }
  
      return acc;
    }, {});  

  // Chart.js data
  const chartData = {
    labels: Object.keys(groupedWorkouts),
    datasets: [
      {
        label: "Total Workout Duration",
        data: Object.values(groupedWorkouts),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Total Workout Duration Over Time",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} minutes`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Duration (minutes)",
        },
        min: 0,
      },
    },
  };

  return (
    <div className="workout-tracking-container">
      {/* Back Button */}
      <button onClick={() => router.back()} className="back-button">
        ⬅ Back
      </button>

      <h1 className="page-title">Workout Tracking</h1>

      {/* Add Workout Form */}
      <div className="add-workout-form">
        <h2>{isEditing ? "Edit Workout" : "Add Workout"}</h2>
        <form>
          <label>
            Workout Type:
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleInputChange}
              placeholder="e.g., Running"
              required
            />
          </label>
          <label>
            Duration (mins):
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleInputChange}
              placeholder="e.g., 30 mins"
              required
            />
          </label>
          <label>
            Frequency:
            <select name="frequency" value={form.frequency} onChange={handleInputChange} required>
              <option value="">Select</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </label>
          <label>
            Intensity:
            <select name="intensity" value={form.intensity} onChange={handleInputChange} required>
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="button" className="primary-button" onClick={handleAddWorkout}>
            {isEditing ? "Update Workout" : "Add Workout"}
          </button>
        </form>
      </div>

      {/* Filter Workouts */}
      <div className="filter-section">
        <h3>Filter Workouts</h3>
        <input
          type="text"
          placeholder="Filter by Workout type or intensity"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Workout History */}
      <div className="workout-history">
        <h2>Workout History</h2>
        {filteredWorkouts.length === 0 ? (
          <p>No workouts logged yet.</p>
        ) : (
          <ul className="workout-list">
            {filteredWorkouts.map((workout, index) => (
              <li key={index} className="workout-item">
                <div className="workout-details">
                  <p><strong>Type:</strong> {workout.type}</p>
                  <p><strong>Duration:</strong> {workout.duration}</p>
                  <p><strong>Frequency:</strong> {workout.frequency}</p>
                  <p><strong>Intensity:</strong> {workout.intensity}</p>
                  <p><strong>Date:</strong> {workout.date}</p>
                </div>
                <div className="action-buttons">
                  <button onClick={() => handleEditWorkout(index)} className="secondary-button">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteWorkout(index)} className="delete-button">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Workout Data Visualization (Chart) */}
      <div className="chart-container">
        <h2>Workout Duration Visualization</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
}