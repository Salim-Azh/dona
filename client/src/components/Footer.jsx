import * as React from 'react';
import './style/Footer.css'

/** React functionnal component that displays the website's footer. */
export function CustomFooter(){
    return (
        <div className='footerContainer'>
            <p className='copyright'>
                © 2022 DonaTrack. All rights reserved.
            </p>
        </div>
    )
};

export default CustomFooter;