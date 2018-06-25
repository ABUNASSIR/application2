import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './composants/Navigation/Navigation';
import FaceRecognition from './composants/FaceRecognition/FaceRecognition';
import Logo from './composants/Logo/Logo';
import ImageLinkForm from './composants/ImageLinkForm/ImageLinkForm';
import Rank from './composants/Rank/Rank';
import Signin from './composants/Signin/Signin';
import Register from './composants/Register/Register';
import './App.css';

const Clarifai = require('clarifai');
const app = new Clarifai.App({
 apiKey: 'cbb092c4f865439bb7b427fae565551c'
});

const particlesoptions = {
	particles: {
            			number: {
            				value:80,
            				density: {
            					enable: true,
            					value_area :8000
            				          }
            			        },
            			  
            	}
}

const inialiste = {
    input:'',
    imageUrl:'',
    box:{},
    route:'Signin',
    isSigned:false,
    user:{
        id: '',
        name: '',
        email: '',
        entries :0,
        joined: '',

    }}
class App extends Component {
  constructor() {
   super();
   this.state = inialiste;   

  }
  




  loadUser = (data) =>{
    this.setState({user:{
         id: data.id,
        name: data.name,
        email: data.email,
        entries :data.entries,
        joined: data.joined,
    }
        
    })
  }

  calculateFaceLocation = (data) =>{
     const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width);
     const height =Number(image.height);
     return {
      leftCol:clarifaiFace.left_col*width,
      topRow:clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height)
     }
  }

  displayFaceBox=(box)=>{
    this.setState({box:box});
  }

  onInputChange = (event)=> {
    this.setState({input:event.target.value});
      }

  onSubmit=() => {
    console.log(this.state.user);
    this.setState({imageUrl:this.state.input});
    app.models.predict(
      "a403429f2ddf4b49b307e318f00e528b", 
      this.state.input)
    .then(response =>{ 
      if (response){
          fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
              id:this.state.user.id,
          })
        })
          .then(response => response.json()) 
          .then(count  => {
                console.log(count);
                this.setState(Object.assign(this.state.user,{entries:count}))
            
          }) 
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err =>console.log(err))
    
  }





  onRouteChange=(route)=>{
  	if (route==='Signout'){
       this.setState(inialiste);

  	}else {
      this.setState({isSigned:true});
   
  	}
  	this.setState({route:route});
  }
  render() {
  	const {isSigned,route}=this.state;
    return (
      <div className="App">
      	<Particles className="particles"
              params={{particlesoptions}}
                      />
        <Navigation isSigned={isSigned} onRouteChange={this.onRouteChange} />
      	{route ==='home' 
      	?<div>
	        <Logo />
	        <Rank name ={this.state.user.name} entries={this.state.user.entries}/>
	        <ImageLinkForm onSubmit={this.onSubmit} 
           onInputChange={this.onInputChange}/> 
           <FaceRecognition box ={this.state.box} imageUrl={this.state.imageUrl} />
	             
	     </div>
      	:(
      	  route ==='Signin' 
		   ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
		   :<Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
		 )
      	    
        }
      </div>
    );
  }
}

export default App;
