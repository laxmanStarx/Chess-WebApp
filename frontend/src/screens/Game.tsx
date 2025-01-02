import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../components/hooks/useSocket"
import { Chess } from "chess.js";
import Chatt from "../components/Chatt";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = "game_over"



const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [isGameStarted, setIsGameStarted] = useState(false); // New state

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setIsGameStarted(true); // Game starts
          console.log("Game initialized");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          console.log("Game over");
          setIsGameStarted(false); // Game ends
          
          break;

          case "invalid_move":
            toast.error(message.payload.message);
            break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-2 w-full justify-center py-10 bg-slate-900 rounded-lg">
            <Chatt isEnabled={isGameStarted} /> {/* Pass state */}
          </div>
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
          </div>
          <div className="col-span-2 w-full justify-center py-10 bg-slate-900 rounded-lg">
            <Button
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );
              }}
            >
              Play
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Game;
