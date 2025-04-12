"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tour } from "@/models/tour";
import Link from "next/link";
import {
  getTourById,
  getBasket,
  addTourOnBasket,
  removeTourFromBasket,
} from "@/services/api";

const TourDetailPage = () => {
  const params = useParams();
  const tourId = Number(params.id); // обязательно преобразуй в число
  const [tour, setTour] = useState<Tour | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [basketId, setBasketId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTourAndBasket = async () => {
      try {
        const [tourResponse, basketResponse] = await Promise.all([
          getTourById(tourId),
          getBasket(),
        ]);

        setTour(tourResponse);
        setBasketId(basketResponse.id);
        console.log("basket", basketResponse);

        const inBasket = basketResponse.tours.some(
          (t: Tour) => t.id === tourId
        );
        setIsInCart(inBasket);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Ошибка при загрузке данных.");
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTourAndBasket();
    }
  }, [tourId]);

  const handleClick = async () => {
    if (!basketId) return;

    try {
      if (isInCart) {
        await removeTourFromBasket(tourId);
        setIsInCart(false);
        alert("Тур удалён из корзины");
      } else {
        await addTourOnBasket(tourId);
        setIsInCart(true);
        alert("Тур добавлен в корзину");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error || !tour) return <div>{error || "Тур не найден"}</div>;

  return (
    <div className="tour-detail-container">
      <h1 className="tour-title">{tour.name}</h1>
      <p className="tour-description">{tour.description}</p>
      <div className="tour-info">
        <p>
          <strong>Destination:</strong> {tour.destination}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(tour.start_date).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(tour.end_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Price:</strong> ${tour.price.toFixed(2)}
        </p>
        <p>
          <strong>Max Capacity:</strong> {tour.max_capacity} people
        </p>
        <button
          onClick={handleClick}
          className={isInCart ? "button-remove" : "button-add"}
        >
          {isInCart ? "Удалить из корзины" : "Добавить в корзину"}
        </button>
        <Link className="basket-link" href="/basket">Моя корзина</Link>
      </div>
    </div>
  );
};

export default TourDetailPage;
