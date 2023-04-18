import { useState } from "react";
import Web3 from "web3";

function Login() {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState("");

  const onClickConnect = async () => {
    // Metamask 가 설치되어 있는지 확인
    if (typeof window.ethereum !== "undefined") {
      try {
        // Metamask 계정 연결
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask를 설치해주세요");
    }
  };

  //   if (web3 && account) {
  //     return <Main web3={web3} account={account} />;
  //   }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <button
          className="bg-green-500 text-white font-bold py-2 px-4 rounded"
          onClick={onClickConnect}
        >
          Metamask connect
        </button>

        {account && (
          <p className="mt-8">
            나의 지갑 주소:{" "}
            <span className="font-bold text-green-500">{account}</span>
          </p>
        )}
      </div>{" "}
    </div>
  );
}

export default Login;
