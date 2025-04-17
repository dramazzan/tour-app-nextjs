"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getAllTours();
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

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  };

  useEffect(() => {
    if (!loading && resultsRef.current) {
      setTimeout(scrollToResults, 100);
    }
  }, [loading]);

  const filteredTours = useMemo(() => {
    let filtered = tours.filter((tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    if (sortOption === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "count") {
      filtered.sort((a, b) => (a.max_capacity || 0) - (b.max_capacity || 0));
    }

    return filtered;
  }, [tours, searchTerm, sortOption]);

  const handleInputFocus = () => {
    scrollToResults();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    scrollToResults();
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-container">
      <div className="main-box">
        <h1 className="welcome-title">Tour Agency Go App</h1>
        <p className="welcome-subtitle">Welcome to the Tour App!</p>
      </div>

      <h1 className="tours-title">Туры</h1>

      <div className="search-sort-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="search-input"
        />
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            scrollToResults(); 
          }}
          className="sort-select"
        >
          <option value="">Без сортировки</option>
          <option value="name">Сортировка по названию</option>
          <option value="price">Сортировка по цене</option>
          <option value="count">Сортировка по количеству</option>
        </select>
      </div>

      
      <div className="tours-container" ref={resultsRef}>
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
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
          ))
        ) : (
          searchTerm.trim() ? (
            <div className="no-results">Ничего не найдено по запросу "{searchTerm}"</div>
          ) : (
            <div className="all-tours">Все доступные туры</div>
          )
        )}
      </div>
    </div>
  );
}