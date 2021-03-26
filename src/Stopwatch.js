import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`text-align: center;user-select: none;`;
const Display = styled.div`font-size: 50px;padding: 10px;`;
const Laps = styled.div`font-size:30px;color:grey;padding:5px;`;
const Button = styled.div`
display:inline-block;
width:200px;
margin:10px;
padding:10px;
font-size:20px;
border-radius:10px;
border:white 1px solid;
:hover {cursor:pointer;border:lightgrey 1px solid;}
`;

const getTimeString = time => {
    const miliseconds = time % 1000;
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const strMiliseconds = `${miliseconds}`.padEnd(3, '0');
    const strSeconds = `${seconds % 60 % 60}`.padStart(2, '0');
    const strMinutes = `${minutes % 60}`.padStart(2, '0');
    const strHours = `${hours}`.padStart(2, '0');
    return `${strHours}:${strMinutes}:${strSeconds}.${strMiliseconds}`;
};

const initialState = {
    time: 0,
    running: false,
    startTime: 0,
    startPauseTime: 0,
    pausedTime: 0,
    laps: []
};

var intervalId;

const Stopwatch = () => {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (state.startPauseTime > 0) return;
            if (!state.running) {
                setState(prev => ({ ...prev, time: 0 }));
                return;
            }
            setState(prev => ({
                ...prev,
                time: Date.now() - state.startTime
            }));
        });
    }, [state.running, state.startPauseTime, state.startTime]);

    const start = useCallback(() => {
        if (state.running)
            setState(initialState);
        else setState(prev => ({
            ...prev,
            running: true,
            startTime: Date.now(),
        }));
    }, [state.running]);

    const lap = useCallback(() => {
        if (!state.running || state.startPauseTime > 0) return;
        setState(prev => ({
            ...prev,
            laps: prev.laps.concat(Date.now() - state.startTime - state.pausedTime - prev.laps.reduce((a, b) => a + b, 0))
        }));
    }, [state.running, state.startPauseTime, state.startTime, state.pausedTime]);

    const pause = useCallback(() => {
        if (!state.running) return;
        if (state.startPauseTime > 0) setState(prev => ({
            ...prev,
            pausedTime: prev.pausedTime + Date.now() - prev.startPauseTime,
            startPauseTime: 0,
        }));
        else setState(prev => ({ ...prev, startPauseTime: Date.now() }));
    }, [state.running, state.startPauseTime]);

    return <Container>
        <Display>{getTimeString(state.time - state.pausedTime)}</Display>
        <Button onClick={start}>{state.running ? 'Stop' : 'Start'}</Button>
        <Button onClick={lap}>Lap</Button>
        <Button onClick={pause}>{state.startPauseTime > 0 ? 'Unpause' : 'Pause'}</Button>
        <div>{state.laps.map((time, i) => <Laps key={i}>{getTimeString(time)}</Laps>)}</div>
    </Container>;
};

export default Stopwatch;
