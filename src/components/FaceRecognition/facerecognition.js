import React from 'react';
import './facerecognition.css';


const FaceRecognition = ({ imageUrl, boundingBoxes }) => {
    return (
      <div className='center ma'>
        <div className='absolute mt2'>
          {imageUrl ? (
            <img id='inputImage' alt='' src={imageUrl} width='500px' height='auto' />
          ) : (
            <p>No image to display</p>
          )}
          {boundingBoxes &&
            boundingBoxes.map((box, index) => (
              <div
                key={index}
                className='bounding-box'
                style={{
                  top: box.topRow,
                  right: box.rightCol,
                  bottom: box.bottomRow,
                  left: box.leftCol,
                }}
              >
                <p className='face-text'>Face Detected</p>
              </div>
            ))}
        </div>
      </div>
    );
  };
export default FaceRecognition;