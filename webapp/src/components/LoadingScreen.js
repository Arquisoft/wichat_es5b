import { PacmanLoader } from "react-spinners";
import React, { useContext } from 'react';
import { LanguageContext } from "../LanguageContext";

const LoadingScreen = () => {
    const { translations } = useContext(LanguageContext);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            "flex-direction": "column"
        }}>
            <h2>{translations.loading || "Cargando..."}</h2>
            <div>
                <PacmanLoader color="#c46331" size={30} />
            </div>
           
        </div>
    );
}

export default LoadingScreen;