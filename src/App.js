import { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/navigation';
import FaceRecognition from './components/FaceRecognition/facerecognition';
import Logo from './components/Logo/logo';
import Rank from './components/Rank/rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ParticlesBg from 'particles-bg'
import Signin from './components/SignIn/signin';
import Register from './components/Register/register';

const initialState = {
    input: '',
    imageUrl: '',
    boundingBoxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        input: this.state.input
      })
    };
  
    fetch('https://face-detective-api-ghlw.onrender.com/imageurl', requestOptions)
      .then(response => response.json())
      .then(data => {
        const boundingBoxes = calculateFaceLocations(data);
        this.setState({ boundingBoxes: boundingBoxes });
  
        // Update image via PUT request
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            id: this.state.user.id
          })
        };
  
        fetch('https://face-detective-api-ghlw.onrender.com/image', requestOptions)
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}));
          })
          .catch(console.log);
      })
      .catch(error => console.log(error));
  }
  
  
  
  
  onRouteChange = (route) => {
    if (route === 'Signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }
    render() {
      const { isSignedIn, imageUrl, route, boundingBoxes} = this.state; 
    return (
      <div className="App">
        <ParticlesBg type="cobweb" color="#e6e9ed" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
         ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
            <FaceRecognition imageUrl={imageUrl} boundingBoxes={boundingBoxes} />
            </div>
            : (
              route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )   
        }
      </div> 
    );
  }
}

const calculateFaceLocations = (data) => {
  const regions = data.outputs[0].data.regions;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  const boundingBoxes = [];
  regions.forEach(region => {
    const face = region.region_info.bounding_box;
    const boundingBox = {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - face.right_col * width,
      bottomRow: height - face.bottom_row * height,
    };
    boundingBoxes.push(boundingBox);
  });
  return boundingBoxes;
};


export default App;