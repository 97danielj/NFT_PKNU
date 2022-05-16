import { renderToString } from 'react-dom/server'
import ContractData from '../Constant/Contract';
import react, {Component, useEffect, useState} from 'react';
import Caver from 'caver-js';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import randomColor from "randomcolor";
import { SwatchesPicker } from 'react-color';

let walletaddr = ContractData.walletaddr;
if(process.env.REACT_APP_NETWORK == "baobab"){
  walletaddr = ContractData.addrBaobab;
}else if(process.env.REACT_APP_NETWORK == "mainnet"){
  walletaddr = ContractData.walletaddr;
}
const dABI = ContractData.dABI;

  




export default function Mint(props) {
    const [nftCount, setNftCount] = useState(0);
    const [account, setAccount] = useState("");
    const [minterAddress, setMinterAddress] = useState("");
    const [mintCnt, setMintCnt] = useState(0);
    const [walletConnection, setWalletConnection] = useState(false);
    let caver = new Caver(window.klaytn);
    let contract = new caver.contract.create(dABI, walletaddr);
  
    
  useEffect(async () => {
    let ret;
    const addr = process.env.REACT_APP_TREASURY_ACCOUNT;
    
    if(window.klaytn){
      // console.log(window.klaytn);
      const [address] = await window.klaytn.enable();      
      setWalletConnection(true);
      setAccount(address);
      setMinterAddress(addr);
      
      window.klaytn.on('accountsChanged', async (accounts) => {
        setAccount(window.klaytn.selectedAddress);
      })    
    }else{
      alert("현재 사용할 수 있는 클레이튼 지갑이 없습니다. 지갑을 설치하신 후 이용바랍니다.");
    }
  },[]); 
  
  useEffect(async () => {    
    if(account.length > 0){
      let mintCount = await contract.methods.getMintedCount(minterAddress).call();
      console.log("count", mintCount);
      setMintCnt(mintCount);
    }
  },[minterAddress]);
  useEffect(async () => {    
    if(account.length > 0 && minterAddress.length > 0){
      let mintCount = await contract.methods.getMintedCount(minterAddress).call();
      setMintCnt(mintCount);
    }
    let ret;
  },[walletConnection]);

  const wait = async (ms) => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve();
      }, ms);
  });
  }
  const connectWallet = async () => {
    if(!window.klaytn._kaikas.isEnabled()){
      const [address] = await window.klaytn.enable();
      setAccount(address);
      setWalletConnection(true);
    }
  }

  const getCurrentPriceOfNFT = async () => {
    const result = await contract.methods.getCurrentPriceOfNFT().call();
    return caver.utils.fromPeb(result);
  };

  const mintNFT = async (e) => {
    let ret;
      ret = await caver.klay.sendTransaction({
          type: 'SMART_CONTRACT_EXECUTION',
          from: account,
          to: walletaddr,
          value: caver.utils.toPeb(1, "KLAY").toString(),
          data: contract.methods.mint(fullNameData, titleData, otherData, backgroundColor, textColor).encodeABI(),
          gas: '850000'
        }).then((res)=>{console.log(res);})
        .catch((err) => {alert("민트에 실패하였습니다.");});
      
        await wait(3000);
  
  }


  const [displayColorPickerBackground, setdisplayColorPickerBackground] = useState(0);
  const [displayColorPickerText, setdisplayColorPickerText] = useState(0);
  const [fullNameData, setfullNameData] = useState("이름");
  const [titleData, settitleData] = useState("소개");
  const [otherData, setotherData] = useState("이메일|회사|웹사이트|SNS");
  const [backgroundColor, setbackgroundColor] = useState("#A3EEFF");
  const [textColor, settextColor] = useState("#17AAB2");
  const [walletAddress, setwalletAddress] = useState("");
  const [currentPriceOfNFT, setcurrentPriceOfNFT] = useState("");




  const handleClickBackground = () => {
    
    setdisplayColorPickerBackground(displayColorPickerBackground);
  };

  const handleCloseBackground = () => {
    
    setdisplayColorPickerBackground(false);
  };
  const handleChangBackground = react.useCallback((color) => setbackgroundColor(color), []);

  const handleClickText = () => {
    setdisplayColorPickerText(displayColorPickerText);
  };

  const handleCloseText = react.useCallback((color) => setdisplayColorPickerText(color), []);

  const handleChangeText = (color, event) => {
    settextColor(color.hex);
  };






  const popover = {
    position: 'absolute',
    zIndex: '99999',
  }
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

  return (
    
    <div>
      <div style={{display: 'flex',justifyContent: 'center'}}>명함 만들기</div>
      <div className="flex flex-col mb-2">
                <div className=" relative ">
                  <input type="text" onChange={e => setfullNameData(e.target.value)} id="rounded-full-name" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="이름"/>
                </div>
      </div>
      <div className="flex flex-col mb-2">
                <div className=" relative ">
                  <input type="text" onChange={e => settitleData(e.target.value)} id="rounded-title" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="소개"/>
                </div>
      </div>
      <div className="flex flex-col mb-4">
                <div className=" relative ">
                  <input type="text" onChange={e => setotherData(e.target.value)} id="rounded-other" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="이메일|회사|웹사이트|SNS"/>
                </div>
      </div>
      <div className="flex pl-2 px-2 mb-2">
                <div className=" relative pl-2 px-2">
                  <button  onClick={ e => setbackgroundColor(randomColor)} className="py-2 px-4 bg-purple-400 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                    랜덤 배경
                  </button>
                </div>
      </div>
      
      <div className="flex pl-2 px-2 mb-12">
                <div className=" relative pl-2 px-2 ">
                  <button  onClick={ e => settextColor(randomColor)} className="py-2 px-4 bg-purple-400 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                  랜덤 글자색
                  </button>
                </div>
       </div>
       {/* <div className=" relative pl-2 px-2 ">
                  <button  onClick={handleClickText} className="py-2 px-4 bg-purple-400 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                  글자색 선택
                  </button>
                  { setdisplayColorPickerText ? <div style={ popover }>
          <div style={ cover } onClick={handleCloseText }/>
          <SwatchesPicker onChange={handleChangeText } />
        </div> : null }
      </div>
      <div className="flex pl-2 px-2 mb-2">
                <div className=" relative pl-2 px-2">
      <button onClick={handleClickBackground} className="py-2 px-4 bg-purple-400 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                    배경 선택
      </button>
      { setdisplayColorPickerBackground ? <div style={ popover }>
          <div style={ cover } onClick={handleCloseBackground}/>
          <SwatchesPicker onChange={handleChangBackground} />
        </div> : null }
                </div>
      </div> */}
      <div className="flex w-full">
                <button  type="submit" onClick={(e) => mintNFT(e)} className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                  NFT 명함 만들기
                </button>
      </div>

      <div className="w-full max-w-md self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
        
        <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 750 500">
  
          <path fill={backgroundColor} d="M0 0h750v500H0z"/>
          <text fontFamily="Noto Sans JP" fontSize="50" fill={textColor} x="50%" y="30%" dominantBaseline="middle" textAnchor="middle">{fullNameData}</text>
          <text fontFamily="Noto Sans JP" fontSize="30" fill={textColor} x="50%" y="40%" dominantBaseline="middle" textAnchor="middle">{titleData}</text>
          <text fontFamily="Noto Sans JP" fontSize="30" fill={textColor} x="50%" y="70%" dominantBaseline="middle" textAnchor="middle">{otherData}</text>
        </svg>
        
        </div>


      <div style={{display: 'flex', justifyContent: 'center'}}><Button variant="contained" style={{height: '50px', width: '200px', margin:'10px', background: '#5D5D5D', color: 'white'}} disabled={walletConnection} onClick={connectWallet}>{walletConnection ? (account.toString().slice(0,10) + "...") : "Wallet Connect"}</Button></div>
      <div style={{display: 'flex',justifyContent: 'center'}}>
        <Stack spacing={1}>
        </Stack>
        
      </div>
    </div>
  );
}

