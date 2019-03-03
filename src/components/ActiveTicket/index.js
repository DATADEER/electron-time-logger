import React from 'react';
import {RecordIndicator} from "../RecordIndicator";
import styled from "styled-components";
import dateFns from "date-fns";
import "./animations.css"
import pauseIcon from "../../static/icons/pause-white.svg";
import stopIcon from "../../static/icons/stop-white.svg";
import startIcon from "../../static/icons/play-white.svg";

const $RecordIndicatorPosition = styled.div`
  top:-1.1rem;
  left:-1.1rem;
`;

const $TimesContainer = styled.div`
    animation: slide-in-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
`;


export class ActiveTicket extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isRecording: false,
            isPaused: false,
            activeInterval: null,
            activeTimeString:this.getPrefixedMinutes(0),
            stoppedAt: null,
            startedAt: null,
            pausedAt: null,
            resumedAt: null,
            pauseOffset:0,

            ticketID:"TICKET-ID",
            isEditingTicketID: false

        };

        this.toggleStartRecording = this.toggleStartRecording.bind(this);
        this.togglePauseRecording = this.togglePauseRecording.bind(this);
        this.convertDateToTime = this.convertDateToTime.bind(this);
        this.getTimeAlreadyPassed = this.getTimeAlreadyPassed.bind(this);
        this.getPrefixedMinutes = this.getPrefixedMinutes.bind(this);
        this.calculatePauseOffset = this.calculatePauseOffset.bind(this);
        this.updateTimer = this.updateTimer.bind(this);

    }

    componentWillUnmount() {
        clearInterval(this.state.activeInterval);
    }

    render(){
        return (
            <div className="relative inline-block border-2 border-grey-darkest px-10 py-6">
                <$RecordIndicatorPosition isRecording={this.state.isRecording} className="absolute" >
                    <RecordIndicator isRecording={this.state.isRecording}/>
                </$RecordIndicatorPosition>
                <div className="flex justify-start">
                    <div className="relative mb-1 border-2 border-black px-5 py-1 inline-flex justify-center items-center">
                        {
                            this.state.isEditingTicketID ?
                            (
                                <input value={this.state.ticketID} autoFocus onBlur={() => this.setState({isEditingTicketID: false})} onChange={(event) => this.setState({ticketID: event.target.value})} />
                            ): (
                                <span className="font-bold inline-block text-xs" onClick={() => {
                                    if(!this.state.isRecording){
                                        this.setState({isEditingTicketID: true});
                                    }
                                }}>{this.state.ticketID}</span>
                            )


                        }
                    </div>
                </div>
                <h1 className="mb-2 text-2xl">TICKET-DESCRIPTION</h1>
                {
                    this.state.isRecording ? (
                            <$TimesContainer className="mb-2">
                                <p className="text-xs text-grey-darker">{ this.convertDateToTime(this.state.startedAt) } - Now</p>
                                <h2 className="text-5xl font-normal" dangerouslySetInnerHTML={{ __html: this.state.activeTimeString}}/>
                            </$TimesContainer>
                        ) : null
                }
                <div className="flex justify-end">
                    <button className="bg-grey-darker hover:bg-grey border-black hover:border-grey-dark text-white text-xs font-bold py-2 px-4 border-b-4  rounded-sm inline-flex justify-center items-center" onClick={this.toggleStartRecording}><img alt="icon start stop" className="w-3 h-3" src={(this.state.isRecording ? stopIcon : startIcon) }/></button>
                    {
                        this.state.isRecording ? (
                            <button className="ml-2 bg-grey-darker hover:bg-grey border-black hover:border-grey-dark text-white text-xs font-bold py-2 px-4 border-b-4 rounded-sm inline-flex justify-center items-center" onClick={this.togglePauseRecording}><img alt="icon pause resume" className="w-3 h-3" src={(this.state.isPaused ? startIcon : pauseIcon) }/></button>
                        ) : null

                    }
                </div>
            </div>
        )
    }

    convertDateToTime(date){
        return dateFns.format(date,"HH:mm")
    }

    getTimeAlreadyPassed(now, startTime, pauseOffset){
        return dateFns.differenceInMinutes(now,startTime) - pauseOffset;
    }

    getPrefixedMinutes(minutes){
        if(minutes < 60){
            return minutes + " <strong>Minutes</strong>"
        }else {
            const minutesPart = minutes % 60;
            const hoursPart = Math.floor(minutes / 60);
            return hoursPart + " <strong>Hours</strong></strong> " + minutesPart + " <strong>Minutes"
        }
    }

    calculatePauseOffset(resumedAt, pausedAt, currentPauseOffset, isPaused){
        if(!isPaused){
            return currentPauseOffset;
        }else {
            return currentPauseOffset + dateFns.differenceInMinutes(resumedAt, pausedAt);

        }

    }

    togglePauseRecording(){
        if(this.state.isPaused){
            this.setState({
                isPaused: false,
                resumedAt: new Date(),
                pauseOffset: this.calculatePauseOffset(new Date(),this.state.pausedAt, this.state.pauseOffset, this.state.isPaused),
                activeInterval: this.updateTimer()
            })
        }else {
            this.setState({
                isPaused : true,
                pausedAt: new Date(),
                resumedAt: null,
            });
            clearInterval(this.state.activeInterval)
        }

    }

    updateTimer(){
        return setInterval(() => {
            this.setState({activeTimeString: this.getPrefixedMinutes(this.getTimeAlreadyPassed(new Date(), this.state.startedAt, this.state.pauseOffset))})
        },1000)
    }



    toggleStartRecording(){
        this.setState((previousState) => {
            return {isRecording : !previousState.isRecording}
        });

        const stopRecording = this.state.isRecording;

        if(stopRecording){

            const finalPauseOffset = this.calculatePauseOffset(new Date(),this.state.pausedAt, this.state.pauseOffset, this.state.isPaused);
            const finalMinutesWorked = this.getTimeAlreadyPassed(new Date(), this.state.startedAt, finalPauseOffset);
            const timespan = `[${dateFns.format(this.state.startedAt, "HH:mm")}- ${dateFns.format(new Date(), "HH:mm")}]`


            localStorage.setItem(this.state.ticketID + timespan || `UNKNOWN-ID${timespan}` , JSON.stringify({
                minutesWorked: finalMinutesWorked,
                minutesPaused: finalPauseOffset
            }));

            this.setState({
                stoppedAt: new Date(),
                startedAt: null,
                activeTimeString: this.getPrefixedMinutes(0),
                pauseOffset: 0,
                pausedAt: null,
                resumedAt: null,
                isPaused: false,
                isRecording: false,
            });
            clearInterval(this.state.activeInterval);

        }else {

            this.setState({
                startedAt: new Date(),
                activeInterval: this.updateTimer()
            });

        }

    }


}