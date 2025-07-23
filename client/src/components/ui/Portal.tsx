
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    
    useEffect(() => {
        let portalRoot = document.getElementById('portal-root');
        if (!portalRoot) {
            portalRoot = document.createElement('div');
            portalRoot.setAttribute('id', 'portal-root');
            // This div will sit at the top level, ready for portals.
            // It doesn't need any styles itself.
            document.body.appendChild(portalRoot);
        }
        setContainer(portalRoot);
    }, []);

    return container ? createPortal(children, container) : null;
};

export default Portal;
