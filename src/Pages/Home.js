import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';
import "../styling/home.css";

const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const tiles = [
        { label: "Extract", path: "/extract", icon: `${process.env.PUBLIC_URL}/extract.png` },
        { label: "Evaluate", path: "/evaluate", icon: `${process.env.PUBLIC_URL}/evaluate.png` },
        { label: "Migrate", path: "/migrate", icon: `${process.env.PUBLIC_URL}/migrate.png` },
    ];

    return (
        <div >
            <Navbar />
            <div className="homeCon">
            <div className="header">
                <h1>Boomi<span className="assess">Assess</span></h1>
            </div>
                <main className="home">

                    {tiles.map(({ label, path, icon }) => {
                        const handleKeyDown = (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                handleNavigation(path);
                            }
                        };

                        return (
                            <article
                                key={label}
                                className="tile"
                                onClick={() => handleNavigation(path)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={handleKeyDown}
                            >
                                <span className="tile__icon" aria-hidden="true">
                                    <img src={icon} alt={`${label} icon`} style={{ width: "64px", height: "64px" }} />
                                </span>
                                <h2 className="tile__title">{label}</h2>
                            </article>
                        );
                    })}
                </main>
                    <footer className="footer">
                        <p>
                            Developed and Maintained by Crave Infotech (for any support: riteek.khaul@craveinfotech.com)
                        </p>
                    </footer>
            </div>
        </div>
    );
};

export default Home;
