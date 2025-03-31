
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Instagram, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-blockbid-darker border-t border-blockbid-light/10 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blockbid-accent to-blockbid-tertiary rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
              <h3 className="text-lg font-semibold">BlockBid</h3>
            </div>
            <p className="text-gray-400 mb-4">The next generation blockchain auction platform where every bid is a guaranteed win.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">Home</button></li>
              <li><button onClick={() => navigate('/items')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">Browse Items</button></li>
              <li><button onClick={() => navigate('/how-it-works')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">How It Works</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/login')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">Login</button></li>
              <li><button onClick={() => navigate('/register')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">Register</button></li>
              <li><button onClick={() => navigate('/dashboard')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">My Bids</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/faq')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">FAQ</button></li>
              <li><button onClick={() => navigate('/contact')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">Contact Us</button></li>
              <li><button onClick={() => navigate('/terms')} className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">Terms & Conditions</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blockbid-light/10 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-blockbid-light-gray">&copy; {year} BlockBid. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors flex items-center">
              <span className="mr-1">Docs</span>
              <ExternalLink size={14} />
            </a>
            <a href="#" className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors flex items-center">
              <span className="mr-1">API</span>
              <ExternalLink size={14} />
            </a>
            <a href="#" className="text-blockbid-light-gray hover:text-blockbid-accent transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
