"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Tour } from "@/models/tour";
import Link from "next/link";
import Image from "next/image";
import {
  getTourById,
  getBasket,
  addTourOnBasket,
  removeTourFromBasket,
  getAllTours,
} from "@/services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const TourDetailPage = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const params = useParams();
  const tourId = Number(params.id);
  const [tour, setTour] = useState<Tour | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [basketId, setBasketId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ создаем ref, чтобы привязать его к контейнеру с результатами
  const tourDetailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTourAndBasket = async () => {
      try {
        const [tourResponse, basketResponse] = await Promise.all([
          getTourById(tourId),
          getBasket(),
        ]);

        setTour(tourResponse);
        setBasketId(basketResponse.id);

        const inBasket = basketResponse.tours.some(
          (t: Tour) => t.id === tourId
        );
        setIsInCart(inBasket);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Ошибка при загрузке данных.");
      } finally {
        setLoading(false);

        // ✅ автоскролл к блоку после загрузки
        setTimeout(() => {
          tourDetailRef.current?.scrollIntoView({
            behavior: "smooth", // плавная прокрутка
            block: "center", // чтобы элемент оказался по центру экрана
          });
        }, 300); // небольшая задержка, чтобы успел отрендериться DOM
      }
    };

    const fetchTours = async () => {
      try {
        const response = await getAllTours();
        setTours(response);
      } catch (err) {
        console.error("Ошибка при загрузке туров:", err);
        setError("Не удалось загрузить туры. Повторите попытку позже.");
      }
    };

    if (tourId) {
      fetchTourAndBasket();
      fetchTours();
    }
  }, [tourId]);

  const handleClick = async () => {
    if (!basketId) return;

    try {
      if (isInCart) {
        const result = await MySwal.fire({
          title: "Удалить из корзины?",
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
          setIsInCart(false);
          MySwal.fire({
            title: "Тур удалён",
            text: "Тур был удалён из корзины.",
            icon: "success",
            confirmButtonText: "Ок",
          });
        }
      } else {
        await addTourOnBasket(tourId);
        setIsInCart(true);
        MySwal.fire({
          title: "Тур добавлен",
          text: "Тур успешно добавлен в корзину.",
          icon: "success",
          confirmButtonText: "Ок",
        });
      }
    } catch (error) {
      console.error("Ошибка:", error);
      MySwal.fire({
        title: "Ошибка",
        text: "Произошла ошибка при добавлении/удалении тура.",
        icon: "error",
        confirmButtonText: "Ок",
      });
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error || !tour) return <div>{error || "Тур не найден"}</div>;

  return (
    <>
      {/* ✅ Привязываем ref к обёртке с деталями тура */}
      <div className="tour-detail-container" ref={tourDetailRef}>
        <div className="tour-container">
          <div className="tour-info">
            <h1 className="tour-title">{tour.name}</h1>
            <p className="tour-description">{tour.description}</p>
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
            <Link className="basket-link" href="/basket">
              Моя корзина
            </Link>
          </div>

          <div className="tour-image-wrapper">
            <Image
              src="/tour_image.png"
              alt={"tour_image"}
              width={350}
              height={300}
              objectFit="cover"
              objectPosition="center"
              className="tour_image"
            />
          </div>
        </div>
      </div>

      <h2 className="between-title">Другие туры</h2>

      <div className="tours-container-child">
        {tours.map((tour) => {
          if (tour.id !== tourId)
            return (
              <div className="tour-card" key={tour.id}>
                <h2 className="tour-name">{tour.name}</h2>
                <p className="tour-description">{tour.description}</p>
                <p className="tour-price">
                  <strong>${tour.price}</strong>
                </p>
                <Link href={`/tours/${tour.id}`}>
                  <button className="tour-link-button">Подробнее</button>
                </Link>
              </div>
            );
        })}
      </div>
    </>
  );
};

export default TourDetailPage;
