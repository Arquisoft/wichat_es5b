import { PacmanLoader } from "react-spinners";

const LoadingScreen = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column"
        }}>
            <h2>Preparando las palomitas...</h2>
            <PacmanLoader color="#c46331" size={30} />
        </div>
    );
}

export default LoadingScreen;