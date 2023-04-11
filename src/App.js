import { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/navigation';
import FaceRecognition from './components/FaceRecognition/facerecognition';
import Logo from './components/Logo/logo';
import Rank from './components/Rank/rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ParticlesBg from 'particles-bg'
import Signin from './components/SignIn/signin';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boundingBoxes: [],
      route: 'Signin'
    };
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    const requestOptions = setupClarifaiJSON(this.state.input);
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", requestOptions)
      .then(response => response.json())
      .then(data => {
        const boundingBoxes = calculateFaceLocations(data);
        this.setState({ boundingBoxes: boundingBoxes });
      })
      .catch(error => console.log('Error fetching API', error));
  }

  onRouteChange = (route) => {
    this.setState({route: route})
  }
    render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" color="#e6e9ed" bg={true} />
        <Navigation onRouteChange={this.onRouteChange}/>
        { this.state.route === 'Signin' 
         ? <Signin onRouteChange={this.onRouteChange}/> 
         : <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange} 
              onSubmit={this.onSubmit}/>
            <FaceRecognition imageUrl={this.state.imageUrl} boundingBoxes={this.state.boundingBoxes} />
          </div>
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

const setupClarifaiJSON = (imageUrl) => {
  const PAT = '9fa8af2849e047bebd8f9436758dfb7b';
  const USER_ID = 'ratkid';       
  const APP_ID = 'my-first-application';
  const MODEL_ID = 'face-recognition';    
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  return requestOptions;
}


export default App;