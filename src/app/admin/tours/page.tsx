"use client";

import { useState, useEffect } from "react";
import { Tour } from "@/models/tour";
import { deleteTour, getAllTours } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const TourListPage = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleDelete = async (tourId: number) => {
    const result = await MySwal.fire({
      title: "Вы уверены?",
      text: "Вы хотите удалить этот тур?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Да, удалить",
      cancelButtonText: "Отмена",
    });

    if (result.isConfirmed) {
      try {
        await deleteTour(tourId);
        setTours((prevTours) => prevTours.filter((tour) => tour.id !== tourId));
        MySwal.fire({
          title: "Тур удалён",
          text: "Тур был успешно удалён.",
          icon: "success",
          confirmButtonText: "Ок",
        });
      } catch (error) {
        console.error("Error deleting tour:", error);
        MySwal.fire({
          title: "Ошибка",
          text: "Не удалось удалить тур.",
          icon: "error",
          confirmButtonText: "Ок",
        });
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tour-list-container">
      <Link href="tours/create" className="create-tour-button">
        Создать новый тур
      </Link>
      <h1 className="tour-list-title">Tour List Page</h1>
      <div className="tour-cards-container">
        {tours.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <div>
              <h2 className="tour-card-title">{tour.name}</h2>
              <p className="tour-card-description">
                {tour.description || "Описание отсутствует."}
              </p>
            </div>
            <div className="btns-box">
              <Link className="update-link" href={`tours/${tour.id}`}>
                Редактировать
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(tour.id)}
                className="update-tour-button delete-button"
              >
                Удалить тур
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourListPage;
