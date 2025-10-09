import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useStationContext } from './services/stationserviceprovider';
import { Schanz } from './mockdata/schanz';
import { Navbar } from './components/utilitycomponents/Navbar';
import { Footer } from './components/utilitycomponents/footer';
import { MockHome } from './components/utilitycomponents/mockhome';
import { Redirect, Route, Switch } from "react-router-dom/cjs/react-router-dom"
import { LanndingPage } from './components/utilitycomponents/landingpage';
function App() {  

  const { getAllNodes, addNode,setStation, } = useStationContext();



  console.log(getAllNodes())


  setTimeout(() => {
    setStation(Schanz);
    console.log("After setting new station data")
    console.log(getAllNodes())  
}, 10000);




  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar></Navbar>

      <main className="flex-grow-1">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>

          <Route path="/home" exact>
            <MockHome />
          </Route>

          <Route path="/landing" exact>
            <LanndingPage></LanndingPage>
          </Route>
        </Switch>
      </main>

      
      <Footer></Footer>
      

    </div>
  );
}

export default App;
