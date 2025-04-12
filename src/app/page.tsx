

"use client"

import { useState, useEffect } from "react";
import { getAllTours } from "@/services/api";
import { Tour } from "@/models/tour";

export default function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getAllTours();
        console.log("Туры:", response);
        setTours(response);
      } catch (err) {
        console.error("Ошибка при загрузке туров:", err);
        setError("Не удалось загрузить туры. Повторите попытку позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <p className="text-lg">Welcome to the Tour App!</p>
      <div>
        <h1>Туры</h1>
        {tours.map((tour) => (
          <div key={tour.id}>
            <h2>{tour.name}</h2>
            <p>{tour.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
