import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private moveCount = 0;
    private isProcessingMove = false;
    private moveTimer: NodeJS.Timeout | null = null;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();

        this.initPlayers();
    }

    private initPlayers() {
        this.player1.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: { color: "white" },
            })
        );
        this.player2.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: { color: "black" },
            })
        );
    }

    makeMove(socket: WebSocket, move: { from: string; to: string }) {
        console.log("Received move:", move);
    
        // Check if the game is already over
        if (this.board.isGameOver()) {
            console.error("Game is already over.");
            return socket.send(
                JSON.stringify({
                    type: "game_over",
                    payload: {
                        message: "The game is already over.",
                    },
                })
            );
        }
    
        // Validate the current turn
        const currentTurn = this.board.turn(); // 'w' or 'b'
        if ((currentTurn === 'w' && socket !== this.player1) || (currentTurn === 'b' && socket !== this.player2)) {
            console.error("Invalid turn: It's not the player's turn.");
            return socket.send(
                JSON.stringify({
                    type: "invalid_turn",
                    payload: {
                        message: "It's not your turn.",
                    },
                })
            );
        }
    
        // Validate move input
        if (!move.from || !move.to) {
            console.error("Invalid move: Missing 'from' or 'to' square.");
            return socket.send(
                JSON.stringify({
                    type: "invalid_move",
                    payload: {
                        message: "Invalid move. 'from' and 'to' squares are required.",
                    },
                })
            );
        }
    
        // Prevent moves to the same square
        if (move.from === move.to) {
            console.error("Invalid move: 'from' and 'to' squares are the same.");
            return socket.send(
                JSON.stringify({
                    type: "invalid_move",
                    payload: {
                        message: "Invalid move: 'from' and 'to' squares cannot be the same.",
                    },
                })
            );
        }
    
        try {
            // Attempt to make the move
            const result = this.board.move(move);
    
            if (!result) {
                console.error("Invalid move attempted:", move);
                return socket.send(
                    JSON.stringify({
                        type: "invalid_move",
                        payload: {
                            message: "Invalid move. Please try again.",
                        },
                    })
                );
            }
    
            console.log("Move successful:", result);
    
            // Broadcast the move to the next player
            const nextPlayer = currentTurn === 'w' ? this.player2 : this.player1;
            nextPlayer.send(
                JSON.stringify({
                    type: MOVE,
                    payload: move,
                })
            );
    
            // Check for game over
            if (this.board.isGameOver()) {
                console.log("Game over detected.");
                const winner = this.board.turn() === 'w' ? 'black' : 'white';
                this.player1.send(
                    JSON.stringify({
                        type: GAME_OVER,
                        payload: { winner },
                    })
                );
                this.player2.send(
                    JSON.stringify({
                        type: GAME_OVER,
                        payload: { winner },
                    })
                );
            } else {
                console.log("Game continues. Next turn.");
            }
    
        } catch (err) {
            // Handle unexpected errors
            console.error("Unexpected error while processing move:", err);
            return socket.send(
                JSON.stringify({
                    type: "error",
                    payload: {
                        message: "An unexpected error occurred while processing the move.",
                    },
                })
            );
        }
    }
    
}    