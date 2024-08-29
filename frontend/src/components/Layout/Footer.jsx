import React, { useContext } from 'react';
import { Context } from '../../main';
import { Link } from 'react-router-dom';
import { FaGithub, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

const Footer = () => {
    const { isAuthorized } = useContext(Context);
    return (
        <footer className={isAuthorized ? 'footerShow' : 'footerHide'}>
            <div>&copy; All Rights Reserved by Aryan.</div>
            <div>
                <Link to={'https://www.linkedin.com/feed/'} target='_blank'>
                    <FaLinkedin />
                </Link>
                <Link to={'https://www.youtube.com/'} target='_blank'>
                    <FaYoutube />
                </Link>
                <Link to={'https://github.com/aryanRiyal/'} target='_blank'>
                    <FaGithub />
                </Link>
                <Link to={'https://www.instagram.com/'} target='_blank'>
                    <RiInstagramFill />
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
