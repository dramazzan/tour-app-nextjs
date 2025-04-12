"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllTours } from "@/services/api";
import { Tour } from "@/models/tour";
import "@/styles/style.css";
import Link from "next/link";

export default function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

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

  // Фильтрация и сортировка туров
  const filteredTours = useMemo(() => {
    // Фильтр по названию (регистр не важен)
    let filtered = tours.filter((tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Сортировка по выбранной опции
    if (sortOption === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "count") {
      // Если поле count не предусмотрено, можно задать значение по умолчанию
      filtered.sort((a, b) => (a.count || 0) - (b.count || 0));
    }

    return filtered;
  }, [tours, searchTerm, sortOption]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-container">
      <h1 className="welcome-title">Hello world!</h1>
      <p className="welcome-subtitle">Welcome to the Tour App!</p>
      <h1 className="tours-title">Туры</h1>

      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-select"
        >
          <option value="">Без сортировки</option>
          <option value="name">Сортировка по названию</option>
          <option value="price">Сортировка по цене</option>
          <option value="count">Сортировка по количеству</option>
        </select>
      </div>

      <div className="tours-container">
        {filteredTours.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <h2 className="tour-name">{tour.name}</h2>
            <p className="tour-description">{tour.description}</p>
            <p className="tour-price">{tour.price}</p>
            <Link href={`/tours/${tour.id}`}>
              <button className="tour-link-button">Подробнее</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
