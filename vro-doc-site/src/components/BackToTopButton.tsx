
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-8 right-8 z-50 
                p-3 rounded-full 
                bg-indigo-600 hover:bg-indigo-700 
                text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/20
                transform transition-all duration-300 ease-in-out
                flex items-center justify-center
                border border-indigo-500/20 backdrop-blur-sm
                group
                ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90 pointer-events-none'}
            `}
            aria-label="Scroll to top"
        >
            <ArrowUp
                size={24}
                className="group-hover:-translate-y-1 transition-transform duration-300"
            />
        </button>
    );
};

export default BackToTopButton;
