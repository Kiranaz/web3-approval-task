import Web3 from "web3";
import { abi } from "./abi/ERC20Abi.json";
let web3;
let erc20Contract;

export const initializeWeb3 = async (
  tokenAddress,
  provider,
  account,
  setTokenBalance,
  setEthBalance
) => {
  console.log("running", provider, account);

  web3 = new Web3(provider);

  erc20Contract = new web3.eth.Contract(
    abi,
    tokenAddress //tokenContractAddress - Rinkeby etherscan
  );
  console.log("after abi", erc20Contract);
  let tokenBalance = await erc20Contract.methods.balanceOf(account).call();
  setTokenBalance((await toWei(tokenBalance)) * Math.pow(10, -18));
  let ethBalance = await getEthBalance(account);
  setEthBalance(await fromWei(ethBalance));
  //console.log('after tokenBalance',await toWei(tokenBalance)*Math.pow(10,-18)) //doing so dafi hy zero decimal
  let isAllowed = await erc20Contract.methods
    .allowance(account, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
    .call();
  console.log(isAllowed);

  if (!parseInt(isAllowed)) {
    console.log('isAllowed')
    await erc20Contract.methods
      .approve(
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        web3.utils.toWei("10000000000000")
      )
      .send({ from: account })
      .on("transactionHash", function (transactionHash) {})
      .on("confirmation", function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
          alert("Approval Success");
        }
      });
  }
};

export const getEthBalance = async (address) => {
  return await web3.eth.getBalance(address);
};
export const fromWei = async (amount) => {
  return await web3.utils.fromWei(amount);
};
export const toWei = async (amount) => {
  return await web3.utils.toWei(amount);
};
