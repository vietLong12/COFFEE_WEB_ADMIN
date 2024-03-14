'use client';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { data } from '../management/fakeData/DataAccount';
import Peer from 'peerjs';

const ENDPOINT = 'http://localhost:5500'; // Địa chỉ máy chủ của bạn
const socket = io.connect(ENDPOINT);

const page = () => {
    const [receivedMessages, setReceivedMessages] = useState<any>([]);
    const videoRef = useRef<any>(null);
    const peerRef = useRef<any>(null);
    const [onMic, setOnMic] = useState(true);
    const [onCam, setOnCam] = useState(true);
    const [online, setOnline] = useState(true);
    useEffect(() => {
        // Kết nối với máy chủ Socket.IO
        const constraints = { video: true, audio: true };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                // Đặt luồng phương tiện cho videoRef
                videoRef.current.srcObject = stream;

                // Tạo một đối tượng Peer
                const peer = new Peer();

                // Khi kết nối Peer được mở, gửi luồng video qua socket
                peer.on('open', (id) => {
                    console.log('Peer ID:', id);
                    const call = peer.call('c7bd2900-cd06-4e10-b60d-48f7f161a22d123', stream); // Thay 'recipientPeerID' bằng ID của Peer nhận luồng
                    console.log('call: ', call);

                    socket.emit('stream', call); // Gửi luồng video tới máy chủ FE khác
                });

                // Lắng nghe sự kiện 'call' và trả lời cuộc gọi
                peer.on('call', (call) => {
                    console.log('call 123: ', call);
                    call.answer(stream); // Trả lời cuộc gọi với luồng video
                });

                // Lưu trữ đối tượng Peer vào state
                peerRef.current = peer;
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
                // Xử lý lỗi
            });

        return () => {
            // Đóng tất cả các luồng video
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }

            if (peerRef) {
                peerRef.current.disconnect();
            }
            // Đóng kết nối Socket.IO khi component bị unmount
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        socket.emit('adminLive');
        socket.on('adminComment', (data) => {
            setReceivedMessages(data);
        });
        socket.on('user-admin-id', (userId) => {

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
                            <Button icon={`pi pi-stop`} severity={`${online ? 'danger' : 'help'}`} rounded className="ml-2" onClick={() => handleOffline()} />
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
