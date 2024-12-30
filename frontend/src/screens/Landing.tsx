import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="pt-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex justify-center rounded-md">
                        <img
                            src={"/cheese.jpg"}
                            className="max-w-full transform transition-transform duration-500 hover:rotate-y-6 hover:scale-105 shadow-lg shadow-purple-500 hover:shadow-2xl rounded-lg"
                            alt="Chess Board"
                        />
                    </div>
                    <div className="pt-16">
                        <div className="flex flex-col items-center">
                            <h1 className="text-4xl font-bold text-center">
                                Play Chess online on the board
                            </h1>
                            <div className="mt-4">
                                <button onClick={()=>{navigate("/game")}} className="px-8 rounded text-2xl bg-green-500 hover:bg-blue-700 text-white font-bold py-2">
                                    Play Online
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
