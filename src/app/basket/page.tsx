"use client";

import { useEffect, useState } from "react";
import { Tour } from "@/models/tour";
import { getBasket, removeTourFromBasket } from "@/services/api";
import Link from "next/link";

const BasketPage = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBasket = async () => {
    try {
      const basket = await getBasket();
      setTours(basket.tours);
    } catch (err) {
      console.error("Ошибка при получении корзины", err);
      setError("Не удалось загрузить корзину.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  const handleRemove = async (tourId: number) => {
    try {
      await removeTourFromBasket(tourId);
      setTours((prev) => prev.filter((t) => t.id !== tourId));
      alert("Тур удалён из корзины");
    } catch (err) {
      console.error("Ошибка при удалении тура", err);
      alert("Произошла ошибка при удалении");
    }
  };

  if (loading) return <div className="basket-message">Загрузка...</div>;
  if (error) return <div className="basket-message">{error}</div>;

  return (
    <div className="basket-container">
      <h1 className="basket-title">Моя корзина</h1>
      {tours.length === 0 ? (
        <p className="basket-message">Корзина пуста</p>
      ) : (
        <ul className="basket-list">
          {tours.map((tour) => (
            <li key={tour.id} className="basket-item">
              <div className="basket-info">
                <h2 className="tour-name">{tour.name}</h2>
                <p className="tour-destination">{tour.destination}</p>
                <p className="tour-price">Цена: ${tour.price.toFixed(2)}</p>
              </div>
              <div className="basket-actions">
                <Link href={`/tours/${tour.id}`}>
                  <button className="tour-link-button">Подробнее</button>
                </Link>
                <button
                  className="button-remove"
                  onClick={() => handleRemove(tour.id)}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BasketPage;
