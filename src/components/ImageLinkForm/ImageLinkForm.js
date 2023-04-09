import React from 'react';
import { CSSProperties } from './ImageLinkForm.css';

const ImageLinkForm = () => {
    return(
        <div>
        <p className='f3'>
            {'Enter a link to any image containing '}
        </p>
            <div className='center'>
              <div className='form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center' type='text' />
                <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'>Detect</button>            
              </div>            
            </div>
        </div>
    );
}

export default ImageLinkForm;