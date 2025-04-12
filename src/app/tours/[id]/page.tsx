"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tour } from "@/models/tour";
import { getTourById } from "@/services/api";

const TourDetailPage = () => {
  const params = useParams();
  const tourId = params.id;
  console.log("Tour ID:", tourId);

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await getTourById(tourId);
        setTour(response);
        console.log("Fetched tour:", response);
      } catch (error) {
        console.error("Error fetching tour:", error);
        setError("Не удалось загрузить информацию о туре.");
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tour-detail-container">
      <h1 className="tour-title">{tour.name}</h1>
      <p className="tour-description">{tour.description}</p>
      <div className="tour-info">
        <p>
          <strong>Destination:</strong> {tour.destination}
        </p>
        <p>
          <strong>Start Date:</strong> {new Date(tour.start_date).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong> {new Date(tour.end_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Price:</strong> ${tour.price.toFixed(2)}
        </p>
        <p>
          <strong>Max Capacity:</strong> {tour.max_capacity} people
        </p>
      </div>
    </div>
  );
};

export default TourDetailPage;
