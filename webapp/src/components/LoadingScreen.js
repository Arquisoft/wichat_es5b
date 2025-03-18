import { PacmanLoader } from "react-spinners";

const LoadingScreen = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            "flex-direction": "column"
        }}>
            <h2>Loading...</h2>
            <div>
                <PacmanLoader color="#c46331" size={30} />
            </div>
           
        
           
        </div>
    );
}

export default LoadingScreen;