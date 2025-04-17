"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTourById, updateTour, deleteTour } from "@/services/api";
import { Tour } from "@/models/tour";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const UpdateTourPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
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
        
        if (!response || !response.id) {
          router.push("/admin/tours");
          return;
        }
  
        setTour(response);
      } catch (error) {
        console.error("Error fetching tour:", error);
        router.push("/admin/tours"); // редирект при ошибке
      }
    };
  
    if (tourId) {
      fetchTour();
    }
  }, [tourId, router]);
  

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
      await updateTour(tourId, updatedTour);
      MySwal.fire({
        title: "Успех",
        text: "Тур успешно обновлен!",
        icon: "success",
        confirmButtonText: "Ок",
      });
      router.push('/admin/tours')
    } catch (error) {
      console.error("Error updating tour:", error);
      MySwal.fire({
        title: "Ошибка",
        text: "Не удалось обновить тур. Попробуйте позже.",
        icon: "error",
        confirmButtonText: "Ок",
      });
    }
  };

  const handleDelete = async () => {
    const confirmed = await MySwal.fire({
      title: "Подтверждение удаления",
      text: "Вы уверены, что хотите удалить этот тур?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Да, удалить",
      cancelButtonText: "Отмена",
    });

    if (!confirmed.isConfirmed) return;

    try {
      await deleteTour(tourId);
      MySwal.fire({
        title: "Успех",
        text: "Тур был удален успешно!",
        icon: "success",
        confirmButtonText: "Ок",
      });
      router.push("/admin/tours");
    } catch (error) {
      console.error("Error deleting tour:", error);
      MySwal.fire({
        title: "Ошибка",
        text: "Не удалось удалить тур.",
        icon: "error",
        confirmButtonText: "Ок",
      });
    }
  };

  return (
    <div className="update-tour-container">
      <h1 className="update-tour-title">Update Tour Form</h1>
      <form onSubmit={handleSubmit} className="update-tour-form">
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

        <div className="update-tour-buttons">
          <button type="submit" className="update-tour-button">
            Редактировать тур
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="update-tour-button delete-button"
          >
            Удалить тур
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTourPage;
