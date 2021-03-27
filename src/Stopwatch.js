import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    user-select: none;
    position: relative;
    text-align: center;
    flex-direction: column;
    width: ${props => props.width ? `${props.width}px` : '100vw'};
    height: ${props => props.height ? `${props.height}px` : '100vh'};
`;

const Display = styled.div`
    flex: 1;
    position: relative;
    > div {
        top: 50%;
        left: 50%;
        width: 266px;
        font-size: 50px;
        text-align: left;
        position: absolute;
        transform: translate(-50%, -50%);
    }
`;

const Laps = styled.div`
    flex: 1;
    overflow: auto;
    max-height: 50%;
    > div {
        color: grey;
        padding: 5px;
        font-size: 30px;
    }
`;

const Button = styled.div`
    display: inline-block;
    width: 200px;
    margin: 20px;
    padding: 10px;
    font-size: 20px;
    border-radius: 10px;
    border: white 1px solid;
    :hover {
        cursor: pointer;
        border: lightgrey 1px solid;
    }
`;

const getTimeString = time => {
    const milliseconds = time % 1000;
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const strMilliseconds = `${milliseconds}`.padEnd(3, '0');
    const strSeconds = `${seconds % 60 % 60}`.padStart(2, '0');
    const strMinutes = `${minutes % 60}`.padStart(2, '0');
    const strHours = `${hours}`.padStart(2, '0');
    return `${strHours}:${strMinutes}:${strSeconds}.${strMilliseconds}`;
};

const initialState = {
    time: 0,
    running: false,
    startTime: 0,
    startPauseTime: 0,
    pausedTime: 0,
    laps: []
};

let intervalId;

const Stopwatch = ({ width, height }) => {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (state.startPauseTime > 0) return;
            if (!state.running) setState(prev => ({ ...prev, time: 0 }));
            else setState(prev => ({ ...prev, time: Date.now() - state.startTime - state.pausedTime }));
        });
        return () => clearInterval(intervalId);
    }, [state.running, state.startPauseTime, state.startTime, state.pausedTime]);

    const start = useCallback(() => {
        if (state.running) setState(initialState);
        else setState(prev => ({ ...prev, running: true, startTime: Date.now(), }));
    }, [state.running]);

    const lap = useCallback(() => {
        if (!state.running || state.startPauseTime > 0) return;
        const deltaTime = Date.now() - state.startTime - state.pausedTime;
        setState(prev => ({ ...prev, laps: [deltaTime - prev.laps.reduce((a, b) => a + b, 0)].concat(prev.laps) }));
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

    return <Container {...{ width, height }}>
        <Display><div>{getTimeString(state.time)}</div></Display>
        <div>
            <Button onClick={start}>{state.running ? 'Stop' : 'Start'}</Button>
            <Button onClick={lap}>Lap</Button>
            <Button onClick={pause}>{state.startPauseTime > 0 ? 'Unpause' : 'Pause'}</Button>
        </div>
        <Laps>{state.laps.map((time, i, a) => <div key={i}>{`${a.length - i}. ${getTimeString(time)}`}</div>)}</Laps>
    </Container>;
};

export default Stopwatch;
