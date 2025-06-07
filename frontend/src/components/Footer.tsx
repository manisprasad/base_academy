import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  BookOpen
} from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
  ];

  const footerSections = [
    {
      title: 'Courses',
      links: [
        { label: 'Web Development', href: '#' },
        { label: 'Data Science', href: '#' },
        { label: 'UX/UI Design', href: '#' },
        { label: 'Digital Marketing', href: '#' },
        { label: 'Mobile Development', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '#' },
        { label: 'Tutorials', href: '#' },
        { label: 'Webinars', href: '#' },
        { label: 'Free Courses', href: '#' },
        { label: 'Career Advice', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Partners', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand and Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <BookOpen className="w-8 h-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold text-white font-display">Base Academy</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering the next generation of digital creators, innovators, and leaders through cutting-edge education and expert mentorship.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                <span className="text-gray-300">info@baseacademy.edu</span>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                <span className="text-gray-300">Base Academy, New Delhi-110005</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-bold mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-gray-800 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Base Academy. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-primary-600 hover:text-white transition-colors"
                aria-label={link.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;