import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <h1>Выберите роль для входа</h1>
            <div className="button-group">
                <button
                    onClick={() => navigate("/department/supervisors")}
                    className="role-button"
                >
                    Кафедра
                </button>
                <button
                    onClick={() => navigate("/student")}
                    className="role-button"
                >
                    Студент
                </button>
                <button
                    onClick={() => navigate("/supervisors/my-topics")}
                    className="role-button"
                >
                    Руководитель
                </button>
            </div>
        </div>
    );
}
