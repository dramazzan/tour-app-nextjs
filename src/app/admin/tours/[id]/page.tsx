"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTourById, updateTour } from "@/services/api";
import { Tour } from "@/models/tour";

// Функция для преобразования дат из ISO в формат YYYY-MM-DD
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const UpdateTourPage: React.FC = () => {
  const params = useParams();
  const tourId = params.id;

  const [tour, setTour] = useState<Tour>({
    id: 0,
    name: "",
    description: "",
    destination: "",
    start_date: "",
    end_date: "",
    price: 0,
    max_capacity: 0,
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await getTourById(tourId);
        setTour(response);
        console.log("Fetched tour:", response);
      } catch (error) {
        console.error("Error fetching tour:", error);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTour((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedTour = {
      ...tour,
      price: parseFloat(tour.price.toString()),
      max_capacity: parseInt(tour.max_capacity.toString(), 10),
      start_date: new Date(tour.start_date).toISOString(),
      end_date: new Date(tour.end_date).toISOString(),
    };

    try {
      const response = await updateTour(tourId, updatedTour);
      console.log("Updated tour:", response);
      alert("Tour updated successfully!");
    } catch (error) {
      console.error("Error updating tour:", error);
      alert("Failed to update tour.");
    }
  };

  return (
    <div className="update-tour-container">
      <h1 className="update-tour-title">Update Tour Form</h1>
      <form
        onSubmit={handleSubmit}
        className="update-tour-form"
      >
        <label className="update-tour-label">
          Name:
          <input
            type="text"
            name="name"
            value={tour.name}
            onChange={handleChange}
            required
            className="update-tour-input"
          />
        </label>

        <label className="update-tour-label">
          Description:
          <textarea
            name="description"
            value={tour.description}
            onChange={handleChange}
            required
            className="update-tour-input"
          />
        </label>

        <label className="update-tour-label">
          Destination:
          <input
            type="text"
            name="destination"
            value={tour.destination}
            onChange={handleChange}
            required
            className="update-tour-input"
          />
        </label>

        <label className="update-tour-label">
          Start Date:
          <input
            type="date"
            name="start_date"
            value={formatDate(tour.start_date)}
            onChange={handleChange}
            required
            className="update-tour-input"
          />
        </label>

        <label className="update-tour-label">
          End Date:
          <input
            type="date"
            name="end_date"
            value={formatDate(tour.end_date)}
            onChange={handleChange}
            required
            className="update-tour-input"
          />
        </label>

        <label className="update-tour-label">
          Price (USD):
          <input
            type="number"
            name="price"
            value={tour.price}
            onChange={handleChange}
            required
            step="0.01"
            className="update-tour-input"
          />
        </label>

        <label className="update-tour-label">
          Max Capacity:
          <input
            type="number"
            name="max_capacity"
            value={tour.max_capacity}
            onChange={handleChange}
            required
            className="update-tour-input"
          />
        </label>

        <button
          type="submit"
          className="update-tour-button"
        >
          Update Tour
        </button>
      </form>
    </div>
  );
};

export default UpdateTourPage;
