    import React, { useEffect, useRef, useState } from 'react'
    import { hightlightsSlides } from '../constants'
    import { ScrollTrigger } from "gsap/all";
    gsap.registerPlugin(ScrollTrigger);
    import gsap from 'gsap'
    import { useGSAP } from '@gsap/react';
    import { pauseImg, playImg, replayImg } from '../utils';

    function VideoCarousel() {

        const videoRef = useRef([]);
        const videoSpanRef = useRef([]);
        const videoDivRef = useRef([]);

  // video and indicator
        const [video,setVideo] = useState({
            isEnd :false,
            startPlay : false,
            videoId:0,
            isLastVideo: false,
            isPLaying:false,

        })
        const[loadedData,setLoadedData] = useState([]);

        const {isEnd, startPlay, videoId, isLastVideo, isPlaying} = video;

       

        useGSAP(()=>{

             // slider animation to move the video out of the screen and bring the next video in
    gsap.to("#slider", {
        transform: `translateX(${-100 * videoId}%)`,
        duration: 2,
        ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
      });

            gsap.to('#video',{
                scrollTrigger:{
                    trigger:'#video',
                    toggleActions:'restart none none none'
                },
                onComplete: () => {
                    setVideo((prev) => ({
                        ...prev,
                        startPlay: true,
                        isPlaying: true,
    
                    }))
                }
            })
        },[isEnd,videoId])

       
    

        useEffect(()=>{
            let currentProgress = 0;
            const span = videoSpanRef.current;

            if (span[videoId]){
                //animate the video
                const anim = gsap.to(span[videoId],{
                    
                onUpdate: ()=>{
                    const progress = Math.ceil(anim.progress()*100);
                    if(progress != currentProgress){
                        currentProgress = progress;
                    }

                    gsap.to(videoDivRef.current[videoId],{
                        width:Window.innerWidth < 760
                        ?'10vw'
                        :window.innerHeight.width<1200
                        ? '10vw'
                        : '4vw'
                    });

                    gsap.to(span[videoId],{
                        width: `${currentProgress}%`,
                        backgroundColor: 'white'
                    })

                },

                onComplete: ()=>{
                    if(isPlaying){
                        gsap.to(videoDivRef.current[videoId],{
                            width: '12px'
                        });

                        gsap.to(span[videoId],{
                            backgroundColor:'afafaf',
                        })
                    }

                }                
                })
                if(videoId ===0){
                    anim.restart();
            }
   // update the progress bar
            const animUpdate = ()=>{
                anim.progress(videoRef.current[videoId] /
                    hightlightsSlides[videoId].videoDuration);
            };
            
            if(isPlaying){
                // ticker to update the progress bar
                gsap.ticker.add(animUpdate)
            }
             else{
                // remove the ticker when the video is paused (progress bar is stopped)
                gsap.ticker.remove(animUpdate)
             }
            }
            

        },[videoId,startPlay])

        useEffect(()=>{
            if(loadedData.length > 3){
                const currentVideo = videoRef.current[videoId]
                if(currentVideo){
                if(!isPlaying){
                    
                   currentVideo.pause();
                
                }else{
                    startPlay && currentVideo.play();
                    
                }
            }}
            },[startPlay, videoId, isPlaying, loadedData])

// vd id is the id for every video until id becomes number 3
        const handleProcess = (type,i) => {
            switch (type) {
                case 'video-end':
                    setVideo((prev) =>({...prev,isEnd:true,videoId:i+1}))

                    break;

                    case 'video-Last':
                        setVideo((prev) =>({...prev,isLastVideo:true}))
                        break;

                        case 'video-reset':
                            setVideo((prev) =>({...prev,isLastVideo:false,videoId:0}))
                        break;

                        case 'play':
                            setVideo((prev) =>({...prev,isPLaying: !prev.isPlaying,videoId:0}))
                            break;

                        case 'pause':
                            setVideo((prev) => ({ ...prev, isPlaying: false }));
                            break;


                default:
                return video;
            }
        };

        
        const handleLoadedMetaData = (i,e)=> setLoadedData
        ((prev)=>[...prev,e])

    return (
        <> 
        <div className='flex items-center'>
            {hightlightsSlides.map((list,i) =>(
            <div key={list.id} id='slider'
            className='sm:pr-20 pr-10'>
                <div className='video-carousel_container'>

                    <div className='w-full h-full flex-Center rounded-3xl overflow-hidden bg-black'>
                        <video id='video' playsInline={true} preload='auto' muted 
                        ref = {(el)=>(videoRef.current[i] = el)}

                        onEnded={()=>
                            i!== 3
                            ? handleProcess('video-end',i)
                            : handleProcess('video-last')
                        }

                        onPlay={()=>{
                            setVideo((prev) =>({
                                ...prev,isPlaying: true
                            }))
                        }}

                        onLoadedMetadata={(e)=>handleLoadedMetaData(i,e)}
                        >
                            <source  src={list.video} type='video/mp4'/>
                        </video>
                    </div>
                    <div className='absolute top-12 left-[5%] z-10'>
                        {list.textLists.map((text)=>(
                            <p key={text} className='md:text-2xl text-xl  font-medium'>{text}</p>

                        ))}</div>
                </div>
            </div>
            ))}
        </div>

        <div className='relative flex-center mt-10'>
            <div className='flex-center py-5 px-7 bg-grey-300 backdrop-blur-0 rounded-full'>
            {videoRef.current.map((_, i) => (
                <span
                key={i}
                className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                ref={(el) => (videoDivRef.current[i] = el)}
                >
                <span
                    className="absolute h-full w-full rounded-full"
                    ref={(el) => (videoDivRef.current[i] = el)}
                />
                </span>
            ))}
            </div>

            <button className='control-btn'>
                <img src={isLastVideo ? replayImg: !isPlaying ? playImg: pauseImg }  
                alt={isLastVideo? 'replay': !isPlaying? 'play':'pause'} 
                onClick={isLastVideo
                ?()=> handleProcess('video-reset')
                : !isPlaying 
                ?()=> handleProcess('play')
                : ()=>handleProcess('pause') } />

            </button>
        </div>
        
        </>
    );
    };

    export default VideoCarousel;
