import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';
interface Props {
    visible: boolean;
}

const LoadingCustom = ({ visible }: Props) => {
    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black-alpha-40 ${!visible ? 'hidden' : ''}`} style={{ zIndex: '9999' }}>
            <div className="flex justify-content-center align-items-center h-full">
                <ProgressSpinner />
            </div>
        </div>
    );
};

export default LoadingCustom;
