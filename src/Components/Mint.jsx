import { renderToString } from 'react-dom/server'
import ContractData from '../Constant/Contract';
import react, {Component, useEffect, useState} from 'react';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import Caver from 'caver-js';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import randomColor from "randomcolor";
import { SwatchesPicker } from 'react-color';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

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


  const [fullNameData, setfullNameData] = useState("이름");
  const [titleData, settitleData] = useState("소개");
  const [otherData, setotherData] = useState("이메일|회사|웹사이트|SNS");
  const [backgroundColor, setbackgroundColor] = useState("#4e6069");
  const [textColor, settextColor] = useState("#ffffff");




 




  const [color, setColor] = useColor("hex", "#121212");

  return (
    
    <div>


      <div style={{display: 'flex',justifyContent: 'center'}}>
        
          <svg width="450" height="350" xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 750 500">
            <path fill={backgroundColor} d="M0 0h750v500H0z"/>
            <text fontFamily="Noto Sans JP" fontSize="50" fill={textColor} x="50%" y="30%" dominantBaseline="middle" textAnchor="middle">{fullNameData}</text>
            <text fontFamily="Noto Sans JP" fontSize="30" fill={textColor} x="50%" y="40%" dominantBaseline="middle" textAnchor="middle">{titleData}</text>
            <text fontFamily="Noto Sans JP" fontSize="30" fill={textColor} x="50%" y="70%" dominantBaseline="middle" textAnchor="middle">{otherData}</text>
          </svg>


      </div>
      <div style={{display: 'flex',justifyContent: 'center'}}>
      <ColorPicker
            width={406}
            height={258}
            color={color}
            onChange={setColor}
            onChangeComplete={(color) => console.log(`Final color: ${color.hex}!`)}
      />
      <div style={{display: 'float',justifyContent: 'center'}}>
      <div>
        <div style={{margin: '7px'}}>
                <div>
                  <TextField label="이름" type="text" onChange={e => setfullNameData(e.target.value)} id="rounded-full-name" placeholder="이름" />
                </div>
        </div>

        <div style={{margin: '7px'}}>
                <div>
                  <TextField label="소개" type="text" onChange={e => settitleData(e.target.value)} id="rounded-title" placeholder="소개"/>
                </div>
        </div>

        <div style={{margin: '7px'}}>
                <div>
                  <TextField label="이메일|회사|웹사이트|SNS" type="text" onChange={e => setotherData(e.target.value)} id="rounded-other" placeholder="이메일|회사|웹사이트|SNS"/>
                </div>
        </div>
      </div>



      <div style={{display: 'float' ,justifyContent: 'center'}}>
        <div style={{margin: '7px'}}>
                  <Button variant="contained" onClick={ e => setbackgroundColor(color.hex)}>
                    배경색 결정
                  </Button>
        </div>

        <div style={{margin: '7px'}}>
                  <Button variant="contained" onClick={ e => settextColor(color.hex)}>
                  글자색 결정
                  </Button>
        </div>
      </div>


       <div style={{margin: '7px'}}>
                <Button variant="contained" type="submit" onClick={(e) => mintNFT(e)}>
                  NFT 명함 민트
                </Button>
      </div>
      </div>
      </div>




      <div style={{display: 'flex', justifyContent: 'center'}}><Button variant="contained" style={{height: '50px', width: '200px', margin:'10px', background: '#5D5D5D', color: 'white'}} disabled={walletConnection} onClick={connectWallet}>{walletConnection ? (account.toString().slice(0,10) + "...") : "Wallet Connect"}</Button></div>
    </div>
  );
}

