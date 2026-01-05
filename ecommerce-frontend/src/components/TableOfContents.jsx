import React, { useState, useEffect } from 'react';

const TableOfContents = ({ contentSelector }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll(`${contentSelector} h2, ${contentSelector} h3`));
        const headingData = elements.map((elem, index) => {
            const id = elem.id || `heading-${index}`;
            elem.id = id;
            return {
                id,
                text: elem.innerText,
                level: Number(elem.tagName.substring(1))
            };
        });
        setHeadings(headingData);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, [contentSelector]);

    if (headings.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4 text-black">Table of Contents</h3>
            <nav>
                <ul className="space-y-2">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
                        >
                            <a
                                href={`#${heading.id}`}
                                className={`block text-sm transition-colors duration-200 ${activeId === heading.id
                                        ? 'text-primary font-medium'
                                        : 'text-secondary hover:text-primary'
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id).scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                }}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default TableOfContents;
