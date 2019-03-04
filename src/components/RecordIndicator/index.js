import React from 'react';
import styled from "styled-components"
import "./animations.css"

import pauseIcon from "../../static/icons/pause-white.svg";

const $RecordingCircle = styled.div`
    
    animation:${(props) => props.isRecording ? "pulsate-bck 2s ease-in-out infinite both" : "none"} ;
    border-radius:${(props) => props.isRecording ? "50%" : "50%"} //TODO: do i still need this?;
`;

const $OuterCircle = styled.div`
  opacity:${(props) => props.isRecording ? 1: 0} ;
`


export class RecordIndicator extends React.Component {

    constructor(props){
        super(props)
        this.state = {

        }

    }

    render(){
        return (

            <$OuterCircle isRecording={this.props.isRecording} className="bg-black w-10 h-10 rounded-full flex items-center justify-center">

                {
                    this.props.isPaused ? (
                        <img className="w-4 h-4" alt="pause icon" src={pauseIcon}/>
                        ) : (
                        <$RecordingCircle isRecording={this.props.isRecording} className="bg-red w-4 h-4"/>

                        )

                }

            </$OuterCircle>

        )
    }


}