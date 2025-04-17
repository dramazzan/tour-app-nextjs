"use client";

import { useState } from "react";
import { addTour } from "@/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CreateTourPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destination: "",
    start_date: "",
    end_date: "",
    price: "",
    max_capacity: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const tourData = {
      ...formData,
      price: parseFloat(formData.price),
      max_capacity: parseInt(formData.max_capacity, 10),
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    };

    try {
      const response = await addTour(tourData);
      console.log("Created tour:", response);
      MySwal.fire({
        title: "Успех",
        text: "Тур был успешно создан!",
        icon: "success",
        confirmButtonText: "Ок",
      });
      router.push("/admin/tours");
    } catch (error) {
      console.error("Error creating tour:", error);
      MySwal.fire({
        title: "Ошибка",
        text: "Не удалось создать тур. Попробуйте позже.",
        icon: "error",
        confirmButtonText: "Ок",
      });
    }
  };

  return (
    <div className="create-tour-container">
      <h1 className="create-tour-title">Create Tour Form</h1>
      <form onSubmit={handleSubmit} className="create-tour-form">
        <label className="create-tour-label">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="create-tour-input"
          />
        </label>

        <label className="create-tour-label">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="create-tour-input"
          />
        </label>

        <label className="create-tour-label">
          Destination:
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="create-tour-input"
          />
        </label>

        <label className="create-tour-label">
          Start Date:
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="create-tour-input"
          />
        </label>

        <label className="create-tour-label">
          End Date:
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="create-tour-input"
          />
        </label>

        <label className="create-tour-label">
          Price (USD):
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            className="create-tour-input"
          />
        </label>

        <label className="create-tour-label">
          Max Capacity:
          <input
            type="number"
            name="max_capacity"
            value={formData.max_capacity}
            onChange={handleChange}
            required
            className="create-tour-input"
          />
        </label>

        <button type="submit" className="create-tour-button">
          Create Tour
        </button>
      </form>
    </div>
  );
};

export default CreateTourPage;
