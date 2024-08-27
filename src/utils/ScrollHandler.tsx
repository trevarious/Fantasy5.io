import { useEffect } from 'react';

const ScrollHandler = () => {
    useEffect(() => {
        let scrolling = false;

        const handleScroll = (event: WheelEvent) => {
            if (scrolling) return;
            scrolling = true;

            const sectionHeight = window.innerHeight;
            const currentScrollPosition = window.scrollY;
            const currentIndex = Math.round(currentScrollPosition / sectionHeight);
            const scrollDirection = event.deltaY > 0 ? 1 : -1;

            // Determine the next section index based on scroll direction
            let nextSectionIndex = currentIndex + scrollDirection;


            // Scroll to the next section
            window.scrollTo({
                top: nextSectionIndex * sectionHeight,
                behavior: 'smooth'
            });

            setTimeout(() => {
                scrolling = false;
            }, 1000); // Adjust timeout to match scroll duration
        };

        window.addEventListener('wheel', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);
    return null;
};

export default ScrollHandler;
