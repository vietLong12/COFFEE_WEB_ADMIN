// @ts-nocheck
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { data } from '../management/fakeData/DataAccount';
import Peer from 'peerjs';
import { BASE_URL } from '../../../common/service/type';

//@ts-ignore
const socket = io.connect(BASE_URL);

const page = () => {
    const [receivedMessages, setReceivedMessages] = useState<any>([]);
    const videoRef = useRef<any>(null);
    const peerRef = useRef<any>(null);
    const [onMic, setOnMic] = useState(true);
    const [onCam, setOnCam] = useState(true);
    const [online, setOnline] = useState(true);
    useEffect(() => {
        const constraints = { video: true, audio: true };
        const peer = new Peer();
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                videoRef.current.srcObject = stream;

                peer.on('open', (id) => {
                    console.log('Peer ID:', id);
                    // const call = peer.call('c7bd2900-cd06-4e10-b60d-48f7f161a22d123', stream);
                    // console.log('call: ', call);

                    socket.emit('stream', id);
                });

                peer.on('call', (call) => {
                    call.answer(stream);
                });

                peerRef.current = peer;
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track: any) => track.stop());
            }

            if (peerRef) {
                peerRef.current.disconnect();
            }
            socket.disconnect(true);
        };
    }, [socket]);

    useEffect(() => {
        socket.emit('adminLive');
        socket.on('adminComment', (data: any) => {
            setReceivedMessages(data);
        });
        socket.on('user-admin-id', (userId: any) => {
            const call = peerRef.current.call(userId, videoRef.current.srcObject);
        });
    }, [socket]);

    return (
        <div className="card h-full">
            <div className="grid">
                <div className="col-8">
                    <div>
                        <div className="border-round">{online ? <video className="border-round w-full" ref={videoRef} autoPlay={onCam} playsInline muted={onMic} /> : ''}</div>
                        <div className="flex justify-content-center mt-4">
                            <Button icon={`pi pi-volume-${onMic ? 'up' : 'off'}`} severity={`${!onMic ? 'danger' : 'help'}`} className="mb-2" onClick={() => setOnMic(!onMic)} rounded />
                            <Button icon={`pi pi-video`} severity={`${!onCam ? 'danger' : 'help'}`} onClick={() => setOnCam(!onCam)} rounded className="ml-2" />
                            <Button icon={`pi pi-stop`} severity={`${online ? 'danger' : 'help'}`} rounded className="ml-2" />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <h5 className="border border-bottom-1 border-black-alpha-70">Tin nhắn hàng đầu:</h5>
                    <div className="border-1 border-round overflow-y-auto" style={{ height: '50vh' }}>
                        <div className="p-2">
                            {receivedMessages.map((msg: { author: string; content: string }, index: number) => {
                                return (
                                    <div className="flex align-align-items-start mb-2" key={index}>
                                        <div className="inline-block mr-2 mt-1">
                                            <Avatar image="https://images.unsplash.com/photo-1509043759401-136742328bb3?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max" size="normal" className="inline-block" shape="circle" />
                                        </div>
                                        <p className="inline-block">
                                            <span className="font-bold">{msg.author}: </span>
                                            {msg.content}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
