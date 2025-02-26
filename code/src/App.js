
// design them modules
import defaultLogo from './images/charged-particles-logo-default-colors.svg';
// import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {Grid, TextField, Button} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './root.theme';

// Wallet modules
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { parseUnits, formatUnits, formatEther } from "@ethersproject/units";
import { abi as IErc20 } from './abis/erc20.json'
import { abi as CPTree } from './abis/cptree.json'

// react modules
import {useState, useRef, useEffect} from 'react'
import { request, gql } from 'graphql-request';
import { Link, useHistory } from 'react-router-dom'

// gsap
import { gsap } from "gsap";

let pts, nPts = gsap.utils.random(9,11,1)

let nPoly = 5
let radius = 180

let ethersProvider;

function getRings(){
  // perform smart contract call to get the charge of the particles for the tree nft
  return nPoly
}

function getBonds(){
  // perfrom a smart contract call on the # of covalent bonds to get the number of point shape
  return pts
}


function setPts(){
  pts = [];  
  for (let i=0; i<nPts; i++){
    const angle = (i/nPts * Math.PI *2)- Math.PI/2;
    const x = Math.cos(angle)*radius+gsap.utils.random(-radius/8,radius/8);
    const y = Math.sin(angle)*radius+gsap.utils.random(-radius/8,radius/8);
    pts.push( x.toFixed(2) + ',' + y.toFixed(2) + ' ');
  }
  gsap.to('.p', {attr:{points:pts}, duration:1.5, ease:'none'});
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ],
})

const cpTreeAddress = '0x5806Fd1Cb9DEc9A3623f2132C2DFA9b2a72Dcf51'
const daiContractAddress = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD'

const getTokenBalance = async (_token, _account, _contract) => {
  let newBalance
  if(_token === 'ETH') {
    newBalance = await ethersProvider.getBalance(_account)

  } else {
    try{
      console.log('_account')
      console.log(_account)
      newBalance = await _contract.balanceOf(_account)
    }catch(e){
      console.log(e)
    }
  }
  return newBalance
}

function getLibrary(provider) {
  console.log(provider)
  // const provider = new ethers.providers.AlchemyProvider
  // const provider = 
  ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
  console.log(ethersProvider.getSigner())

  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const convertValue = (_amountInUnits, _decimals, _toEthMultiplier) => {
let decimals = _decimals ? _decimals : 18
let toEthMultiplier = _toEthMultiplier ? _toEthMultiplier : 1
return (parseFloat(formatUnits(_amountInUnits, decimals)) * toEthMultiplier)
}

const formattedValue = (_amountInUnits, _decimals, _toEthMultiplier) => {
return convertValue(_amountInUnits, _decimals, _toEthMultiplier).toLocaleString()
}

let cpTree;

export const Wallet = (props) => {
  const { chainId, account, activate, active } = useWeb3React()

    useEffect(async () => {
      console.log(`use effect -- account: ${account}`)
      console.log(ethersProvider)
      if(ethersProvider){

      const balance = await getTokenBalance(
          'DAI', 
          account, 
          new ethers.Contract(daiContractAddress, IErc20, ethersProvider.getSigner())
          )
        if(balance != undefined){
          console.log(balance)
          console.log(balance.toString())
          props.setBigbalance(balance)
          props.setBalance(formattedValue(balance, 18))
          props.setAccount(account)
        }

          console.log('---------')
        cpTree = new ethers.Contract(cpTreeAddress, CPTree, ethersProvider.getSigner())
          console.log('---------')
          console.log(cpTree)
        cpTree.deployed((c) => {
          console.log('---------')
          console.log(c)
        }) 
      }else {
        console.log('provider NOT_SET')
      }

    }, [account,active,ethersProvider, cpTree])

  const onActivateClick = async () => {
      activate(injectedConnector)
  }

  return (
    <div className="simple-form">
      {active ? (
        <>
          <div >account: {account ? account.substring(0,5)+'...' : ''}</div>
          <div >dai balance: {props.balance}</div>
          <div> ✅ </div>
        </>
      ) : (
        <Button variant="contained" color="primary" name="connect" style={{marginLeft: '-9px'}} onClick={() => onActivateClick()}>⎈</Button>
      )}
    </div>
  )
}


const Account = (props) => {
  const [account, setAccount ] = useState('')
  const [balance, setBalance ] = useState(0)
  const [bigbalance, setBigbalance ] = useState(0)
  const [approved, setApproved ] = useState(false)
  const history = useHistory();

  console.log(props.id)
  console.log(account)
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {props.base ? '' : <p>{'⇪'}</p> }
      <Wallet balance={balance} setBigbalance={setBigbalance} setBalance={setBalance} setAccount={setAccount}/>
      {/*wallet*/}
      {/*approve*/}
      {/*deposit*/}
    </Web3ReactProvider>
  )
}

const Tree = () => {
  const rings = useRef();

  useEffect(() => {

    setTimeout((nPoly) => {
      nPoly=nPoly+5
    }, 2000, nPoly)

  for (let i=1; i<=nPoly; i++){ //make + animate empty polygon elements
    let p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let stage = document.getElementById("stage");
    stage.appendChild(p);  

  
    gsap.set(p, {
      attr:{ class:'p p'+i },
      scale:0,
      x:250,
      y:250,
      fill:'none',
      // fill:()=>(i%2==0)?'#fff':'#000',
      stroke:'green',
      strokeWidth:1+Math.random()
    });
    
    gsap
      .timeline({ repeat:-1 })
      .to(p, {
        duration:4+i/getRings()*3,
        scale:0.5,
        ease:'expo'
      })
      .seek(9)
  }

    gsap.to(window, {duration:1.5, repeat:-1, onStart:setPts, onRepeat:setPts});

  })

     return(<svg ref={rings} id="stage" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" stroke="none"></svg>)

}

const App = () => {

  const [particleValue, setParticleValue] = useState()


  const query = gql`
    {
     universes {
       protonToken {
         tokens(first:20) {
           name,
           tokenId,
           id
           creator,
           owner,
           salePrice,
           lastSalePrice,
         }
       }
     }
    }`
 
  const doGraphRequest = (endpoint, query, variables={}) => new Promise((resolve, reject) => {
    request(endpoint, query, variables)
      .then((data) => resolve(data))
      .catch(err => reject(err));
  });

  setTimeout(async () => {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/charged-particles/kovan-universe';
    const res: any = await doGraphRequest(endpoint, query);
    const { protonToken } = res.universes[0];
    console.log(protonToken);
  }, 2000)

  const plantCPTree = async () => {
    console.log('planting tree')
    const tx = await cpTree.plant('aave', daiContractAddress, particleValue, 'QmQW3dWkX9vPRDfPprhu8pqtVKAkroh9aXgfs5SqtpxpsM')
    console.log(tx)
  }


  return (
    <ThemeProvider theme={{ ...theme }}>
      <main>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="subtitle1">
                wood wide web 
              </Typography>
            </Grid>
            <Account /*id={id} setModal={setModal}*/ />
          </Grid>
          <Grid container direction="column">
            <Grid item>
              <TextField id="standard-basic" value={particleValue} label="Standard" onChange={e => setParticleValue(e.target.value)}/>
              <TextField id="standard-basic" label="Standard"/>
              <Button variant="contained" color="primary" onClick={plantCPTree}>
                Primary
              </Button>
              <Tree />
            </Grid>
          </Grid>

        </main>
    </ThemeProvider>
  );
}

export default App;
