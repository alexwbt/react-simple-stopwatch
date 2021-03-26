import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    text-align: center;
    user-select: none;
`;

const Button = styled.div`
    display: inline-block;
    width: 200px;
    margin: 10px;
    padding: 10px;
    font-size: 20px;
    border-radius: 10px;
    border: white 1px solid;

    :hover {
        cursor: pointer;
        border: lightgrey 1px solid;
    }
`;

const Display = styled.div`
    font-size: 50px;
    padding: 10px;
`;

const Laps = styled.div`
    font-size: 30px;
    color: grey;
    padding: 5px;
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

const startInterval = (startTime, setTime) => setInterval(() => setTime(Date.now() - startTime));

const Stopwatch = () => {
    const [running, setRunning] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [time, setTime] = useState('');
    const [timerInterval, setTimerInterval] = useState();
    const [laps, setLaps] = useState([]);
    const [startPauseTime, setStartPauseTime] = useState(0);
    const [pausedTime, setPausedTime] = useState(0);

    const start = useCallback(() => {
        if (running) {
            setRunning(false);
            setStartTime(0);
            setPausedTime(0);
            setStartPauseTime(0);
            clearInterval(timerInterval);
            setLaps([]);
            setTime(0);
        } else {
            setRunning(true);
            setStartTime(Date.now());
            setTimerInterval(startInterval(Date.now(), setTime));
        }
    }, [running, setTime, timerInterval]);

    const lap = useCallback(() => {
        if (!running || startPauseTime > 0) return;
        setLaps(laps => laps.concat(Date.now() - startTime - pausedTime - laps.reduce((a, b) => a + b, 0)));
    }, [running, startPauseTime, startTime, pausedTime]);

    const pause = useCallback(() => {
        if (!running) return;
        if (startPauseTime > 0) {
            setPausedTime(pre => pre + Date.now() - startPauseTime);
            setStartPauseTime(0);
            setTimerInterval(startInterval(startTime, setTime));
        } else {
            setStartPauseTime(Date.now());
            clearInterval(timerInterval);
        }
    }, [running, startPauseTime, timerInterval, startTime]);

    return <Container>
        <Display>{getTimeString(time - pausedTime)}</Display>
        <Button onClick={start}>{running ? 'Stop' : 'Start'}</Button>
        <Button onClick={lap}>Lap</Button>
        <Button onClick={pause}>{startPauseTime > 0 ? 'Unpause' : 'Pause'}</Button>
        <div>{laps.map((time, i) => <Laps key={i}>{getTimeString(time)}</Laps>)}</div>
    </Container>;
};

export default Stopwatch;
