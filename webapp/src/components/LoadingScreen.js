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
            flexDirection: "column"
        }}>

            <h2>{translations.loading_popcorn || "Preparando las palomitas..."}</h2>
            <PacmanLoader color="#c46331" size={30} />

        </div>
    );
}

export default LoadingScreen;