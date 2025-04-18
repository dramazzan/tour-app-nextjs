"use client";

import { useEffect, useState } from "react";
import { User } from "@/models/user";
import {GetCurrentUser, isAdmin, UpdateCurrentUser} from "@/services/api";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Link from "next/link";

const MySwal = withReactContent(Swal);


const DashboardPage = () => {
    const [user, setUser] = useState<User | undefined>();
    const [isEditing, setIsEditing] = useState<{ username: boolean; email: boolean }>({
        username: false,
        email: false,
    });
    const [newUserData, setNewUserData] = useState<{ username: string; email: string }>({
        username: "",
        email: "",
    });
    const [isFormDirty, setIsFormDirty] = useState<{ username: boolean; email: boolean }>({
        username: false,
        email: false,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [admin , setAdmin] = useState(false);



    useEffect(() => {
        const fetchCurrentUser = async () => {
            setIsLoading(true);
            try {
                const response = await GetCurrentUser();
                setUser(response.user);
                setNewUserData({
                    username: response.user.username,
                    email: response.user.email,
                });
                console.log("response", response);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Не удалось загрузить данные пользователя");
            } finally {
                setIsLoading(false);
            }
        };

        const getUserRole = () =>{
            try {
                const response = isAdmin()
                setAdmin(response)
            }catch(err){
                console.log(err);
            }
        }

        getUserRole()
        fetchCurrentUser();
    }, []);

    const handleClickEdit = (field: "username" | "email") => {
        setIsEditing((prevState) => ({
            ...prevState,
            [field]: true,
        }));

        if (user) {
            setIsFormDirty((prevState) => ({
                ...prevState,
                [field]: newUserData[field] !== user[field],
            }));
        }
    };

    const handleBlur = (field: "username" | "email") => {
        if (!isFormDirty[field]) {
            setIsEditing((prevState) => ({
                ...prevState,
                [field]: false,
            }));
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, field: "username" | "email") => {
        const newValue = event.target.value;
        setNewUserData((prevData) => ({
            ...prevData,
            [field]: newValue,
        }));

        if (user) {
            setIsFormDirty((prevState) => ({
                ...prevState,
                [field]: newValue !== user[field],
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            console.log("Отправка данных:", newUserData);

            if (user) {
                setUser({
                    ...user,
                    username: newUserData.username,
                    email: newUserData.email
                });
            }

            setIsFormDirty({
                username: false,
                email: false,
            });

            setIsEditing({
                username: false,
                email: false,
            });

           const response = await UpdateCurrentUser(newUserData);
           console.log("response", response);

            MySwal.fire({
                title: "Данные изменены",
                text: "Данные успешно изменен",
                icon: "success",
                confirmButtonText: "Ок",
            });
        } catch (err) {
            console.error("Ошибка при отправке данных", err);
            MySwal.fire({
                title: "Ошибка",
                text: "Не удалось изменить данные",
                icon: "error",
                confirmButtonText: "Ок",
            });
        }
    };

    const handleCancel = () => {
        if (user) {
            setNewUserData({
                username: user.username,
                email: user.email,
            });
        }

        setIsFormDirty({
            username: false,
            email: false,
        });

        setIsEditing({
            username: false,
            email: false,
        });
    };

    if (isLoading) {
        return <div className="container">Загрузка данных...</div>;
    }

    if (error) {
        return <div className="container text-red-500">{error}</div>;
    }

    return (
        <div className="container">
            <h2>Добро пожаловать на вашу страницу</h2>
            <h3>Здесь вы можете редактировать ваше имя или email</h3>
            <p>Для этого просто нажмите на текст</p>
            <div className="admin-link-box">
                {
                    admin && (
                        <Link href="/admin/tours">Панель для админа</Link>
                    )
                }
            </div>
            <div className="profile-box">
                <div className="input-box">
                    <div className="input-group">
                        <label>Имя пользователя:</label>
                        {isEditing.username ? (
                            <input
                                type="text"
                                value={newUserData.username}
                                onChange={(e) => handleChange(e, "username")}
                                onBlur={() => handleBlur("username")}
                                autoFocus
                            />
                        ) : (
                            <span
                                onClick={() => handleClickEdit("username")}
                                className="editable-text"
                            >
                                {newUserData.username}
                            </span>
                        )}
                    </div>

                    <div className="input-group">
                        <label>Email:</label>
                        {isEditing.email ? (
                            <input
                                type="email"
                                value={newUserData.email}
                                onChange={(e) => handleChange(e, "email")}
                                onBlur={() => handleBlur("email")}
                                autoFocus
                            />
                        ) : (
                            <span
                                onClick={() => handleClickEdit("email")}
                                className="editable-text"
                            >
                                {newUserData.email}
                            </span>
                        )}
                    </div>
                </div>

                {(isFormDirty.username || isFormDirty.email) && (
                    <div className="button-group">
                        <button
                            onClick={handleSubmit}
                            className="button-save"
                        >
                            Сохранить изменения
                        </button>
                        <button
                            onClick={handleCancel}
                            className="button-cancel"
                        >
                            Отмена
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;