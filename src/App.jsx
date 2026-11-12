import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminModal from './components/admin/AdminModal';
import AdminTrigger from './components/admin/AdminTrigger';

export default function App() {
  return (
    <PortfolioDataProvider>
      <ThemeProvider>
        <div className="portfolio-app">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </main>
          <Footer />

          {/* Dynamic Admin CMS & Shortcuts */}
          <AdminModal />
          <AdminTrigger />
        </div>
      </ThemeProvider>
    </PortfolioDataProvider>
  );
}
