import React from "react";
import { Linkedin, Github, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-500",
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com",
      label: "GitHub",
      color: "hover:text-white",
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      href: "https://youtube.com",
      label: "YouTube",
      color: "hover:text-red-500",
    },
  ];

  return (
    <footer className="relative bg-[#050505] pt-20 pb-10 border-t border-white/5 overflow-hidden font-sans">
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      {/* Ambient Background Light */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6 max-w-[1400px]">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8 mb-12">
          {/* Left Content */}
          <div className="max-w-lg">
            <h4 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3">
              Let's Keep in Touch!
            </h4>
            <h5 className="text-base md:text-lg text-gray-400 font-light leading-relaxed">
              Find us on any of these platforms. We respond in 1-2 business
              days.
            </h5>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={`p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-white/30 ${social.color} hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] group relative`}
              >
                {social.icon}

                {/* Simple Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/10 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>Copyright © {currentYear}</span>
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              CineVerse
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>Powered by TMDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
