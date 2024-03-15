// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
//
// function GameLobbyPage() {
//     const [gameCode, setGameCode] = useState("");
//     const [players, setPlayers] = useState([]);
//     const socket = io("http://localhost:8080");
//
//     useEffect(() => {
//         const storedGameCode = sessionStorage.getItem("gameCode");
//         setGameCode(storedGameCode);
//
//         socket.emit("joinRoom", storedGameCode);
//
//         socket.on("updateLobby", (playerList) => {
//             setPlayers(playerList);
//         });
//
//         return () => {
//             socket.disconnect();
//         };
//     }, []);
//
//     return (
//         <div>
//             <h2>Game Lobby</h2>
//             <p>Game Code: {gameCode}</p>
//             <h3>Players:</h3>
//             <ul>
//                 {players.map((player, index) => (
//                     <li key={index}>{player}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
//
// export default GameLobbyPage;

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function GameLobbyPage() {

    return (
        <div>
            <h2>Game Lobby</h2>
        </div>
    );
}

export default GameLobbyPage;