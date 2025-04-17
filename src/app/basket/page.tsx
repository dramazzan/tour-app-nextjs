"use client";

import { useEffect, useState } from "react";
import { Tour } from "@/models/tour";
import { getBasket, removeTourFromBasket } from "@/services/api";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
      const result = await MySwal.fire({
        title: "Удалить этот тур?",
        text: "Вы уверены, что хотите удалить этот тур из корзины?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Да, удалить",
        cancelButtonText: "Отмена",
      });

      if (result.isConfirmed) {
        await removeTourFromBasket(tourId);
        setTours((prev) => prev.filter((t) => t.id !== tourId));
        MySwal.fire({
          title: "Тур удалён",
          text: "Тур был удалён из корзины.",
          icon: "success",
          confirmButtonText: "Ок",
        });
      }
    } catch (err) {
      console.error("Ошибка при удалении тура", err);
      MySwal.fire({
        title: "Ошибка",
        text: "Произошла ошибка при удалении тура.",
        icon: "error",
        confirmButtonText: "Ок",
      });
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
                  <button className="basket-tour-link-button">Подробнее</button>
                </Link>
                <button
                  className="basket-button-remove"
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
