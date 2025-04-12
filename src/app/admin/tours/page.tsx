"use client";

import { useState, useEffect } from "react";
import { Tour } from "@/models/tour";
import { getAllTours } from "@/services/api";

const TourListPage = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getAllTours();
        console.log("admin response: ", response);
        setTours(response);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить туры. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tour-list-container">
      <h1 className="tour-list-title">Tour List Page</h1>
      <div className="tour-cards-container">
        {tours.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <h2 className="tour-card-title">{tour.name}</h2>
            <p className="tour-card-description">{tour.description || "Описание отсутствует."}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourListPage;
