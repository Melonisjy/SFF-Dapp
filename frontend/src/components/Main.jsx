import { useEffect, useState } from "react";
import FootballToken from "../contracts/FootballToken.json";
import FootballGame from "../contracts/FootballGame.json";

function Main({ web3, account }) {
  const [footballGame, setFootballGame] = useState(null);
  const [gameIds, setGameIds] = useState([]);
  const [gameDetails, setGameDetails] = useState([]);
  const [gameResults, setGameResults] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // 스마트컨트랙트 인스턴스화
        const networkId = await web3.eth.net.getId();
        const footballToken = new web3.eth.Contract(
          FootballToken.abi,
          FootballToken.networks[networkId].address
        );
        const footballGameAddress = await footballToken.methods
          .footballGameAddress()
          .call();
        const footballGame = new web3.eth.Contract(
          FootballGame.abi,
          footballGameAddress
        );
        setFootballGame(footballGame);

        // 축구경기 일정 가져오기
        const gameIds = await footballGame.methods.getAllGameIds().call();
        setGameIds(gameIds);

        // 축구경기 결과 가져오기
        const gameResults = await Promise.all(
          gameIds.map((gameId) =>
            footballGame.methods.getGameResult(gameId).call()
          )
        );
        setGameResults(gameResults);

        // 축구경기 상세정보 가져오기
        const gameDetails = await Promise.all(
          gameIds.map((gameId) =>
            footballGame.methods.getGameDetails(gameId).call()
          )
        );
        setGameDetails(gameDetails);
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, [web3]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Football Game Schedule</h1>
      <div className="grid grid-cols-3 gap-4">
        {gameIds.map((gameId, index) => (
          <div
            className="p-4 bg-gray-100 rounded-md shadow-md flex flex-col justify-between"
            key={gameId}
          >
            <div className="text-lg font-bold">{gameDetails[index].name}</div>
            <div className="text-sm text-gray-500">
              {gameDetails[index].location} - {gameDetails[index].date}
            </div>
            {gameResults[index].exists && (
              <div className="text-lg font-bold mt-4">
                {gameResults[index].homeScore} : {gameResults[index].awayScore}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
