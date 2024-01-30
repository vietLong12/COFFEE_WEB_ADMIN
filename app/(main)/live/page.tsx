'use client';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const page = () => {
    const videoRef = useRef<any>(null);
    const [onMic, setOnMic] = useState(false);
    const [onCam, setOnCam] = useState(false);
    const [online, setOnline] = useState(false);
    const handleOffline = () => {
        setOnline(!online);
    };

    useLayoutEffect(() => {
        const constraints = { video: true };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });

        return () => {
            if (videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [onCam]);
    return (
        <div className="card h-full">
            <div className="grid">
                <div className="col-8">
                    <div>
                        <div className="border-round">{online ? <video className="border-round w-full" ref={videoRef} autoPlay={onCam} playsInline muted={onMic} /> : ''}</div>
                        <div className="flex justify-content-center mt-4">
                            <Button icon={`pi pi-volume-${onMic ? 'up' : 'off'}`} severity={`${!onMic ? 'danger' : 'help'}`} className="mb-2" onClick={() => setOnMic(!onMic)} rounded />
                            <Button icon={`pi pi-video`} severity={`${!onCam ? 'danger' : 'help'}`} onClick={() => setOnCam(!onCam)} rounded className="ml-2" />
                            <Button icon={`pi pi-stop`} severity={`${online ? 'danger' : 'help'}`} rounded className="ml-2" onClick={() => handleOffline()} />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <h5 className="border border-bottom-1 border-black-alpha-70">Tin nhắn hàng đầu:</h5>
                    <div className="border-1 border-round overflow-y-auto" style={{ height: '50vh' }}>
                        <div className="p-2">
                            <div className="flex align-align-items-start mb-2">
                                <div className="inline-block mr-2 mt-1">
                                    <Avatar image="https://images.unsplash.com/photo-1509043759401-136742328bb3?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max" size="normal" className="inline-block" shape="circle" />
                                </div>
                                <p className="inline-block">
                                    <span className="font-bold">Nguyễn Việt Long :</span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, facere.
                                </p>
                            </div>

                            <div className="flex align-align-items-start mb-2">
                                <div className="inline-block mr-2 mt-1">
                                    <Avatar image="https://images.unsplash.com/photo-1509043759401-136742328bb3?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max" size="normal" className="inline-block" shape="circle" />
                                </div>
                                <p className="inline-block">
                                    <span className="font-bold">Nguyễn Việt Long: </span>
                                    Lorem, ipsum dolor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;