import React from 'react'
import './footer.css';
import amazonLogo from '../../Assets/amazonLogo.png'
const Footer = () => {
    return (
        <div className="footer">
            <div className="footerContent">
                <div className="footerCont1">
                    <div className="contentFooterTitle">Get To Know Us</div>
                    {/* please watch the video for code */}

                </div>
                <div className="footerCont1">
                    <div className="contentFooterTitle">Connect With Us</div>
                    <div className="contentFooterSubTitlediv">
                        <div className="contentFooterSubTitleCont">Instagram</div>
                        <div className="contentFooterSubTitleCont">Twitter</div>
                        <div className="contentFooterSubTitleCont">Facebook</div>
                    </div>
                </div>

                <div className="footerCont1">
                    <div className="contentFooterTitle">Make Money With US</div>
                    {/* please watch the video for code */}
                </div>
                
                <div className="footerCont1">
                    <div className="contentFooterTitle">Lets Us Help You</div>
                    {/* please watch the video for code */}
                </div>
            </div>
            <div className="amazonImg">
                <img className='amazonImgFooter' src={amazonLogo} />
            </div>
        </div>
    )
}

export default Footer