import { SamrakshIcon } from '../navbar/icons';
import { NavLink } from 'react-router-dom';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { Creators } from '@/constants/creators';

const Footer = () => {
    return (
        <footer className="bg-brand-50 text-brand-900 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                    <NavLink to="/" className="flex items-center mb-4 md:mb-0">
                        <SamrakshIcon className="h-12 text-brand-600 mr-3" />
                        <span className="text-2xl font-semibold text-center md:text-left">Kumbh Mela Management</span>
                    </NavLink>

                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center">
                        <NavLink to="/" className="hover:underline text-brand-900">Home</NavLink>
                        <NavLink to="/about" className="hover:underline text-brand-900">About Us</NavLink>
                        <NavLink to="/services" className="hover:underline text-brand-900">Services</NavLink>
                        <NavLink to="/contact" className="hover:underline text-brand-900">Contact</NavLink>
                    </div>
                </div>

                <div className="mt-8 border-t border-brand-300 pt-4">

                    <p className="text-brand-700 mb-2 text-center md:text-left">
                        This project is made for the management of the Kumbh Mela by:
                    </p>
                    <ul className="text-brand-700 space-y-4">
                        {Creators.map((creator, index) => (
                            <li key={index} className="flex flex-col md:flex-row justify-center md:justify-start items-center">
                                <span className="mr-2">{creator.name}</span>
                                <a href={`mailto:${creator.email}`} className="flex items-center text-brand-600 hover:text-brand-500">
                                    <FaEnvelope className="mr-1" />
                                    {creator.email}
                                </a>
                                <a href={creator.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-brand-600 hover:text-brand-500 md:ml-4 mt-2 md:mt-0">
                                    <FaLinkedin className="mr-1" />
                                    LinkedIn
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex flex-col md:flex-row justify-center md:justify-start items-center space-y-4 md:space-y-0 md:space-x-6">
                        <a href="#" className="hover:text-brand-500">Twitter</a>
                        <a href="#" className="hover:text-brand-500">Facebook</a>
                        <a href="#" className="hover:text-brand-500">Instagram</a>
                        <a href="#" className="hover:text-brand-500">LinkedIn</a>
                    </div>
                    
                    <div className="mt-6 text-center md:text-left text-brand-600">
                        <p>© {new Date().getFullYear()} Kumbh Mela Management. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
