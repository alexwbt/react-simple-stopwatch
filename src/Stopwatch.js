import React, { useCallback, useState } from 'react';

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
        setLaps(laps => laps.concat([Date.now() - startTime - pausedTime - laps.reduce((a, b) => a + b, 0)]));
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

    return <div>
        <div>{getTimeString(time - pausedTime)}</div>
        <div>{laps.map((time, i) => <div key={i}>{getTimeString(time)}</div>)}</div>
        <button onClick={start}>{running ? 'stop' : 'start'}</button>
        <button onClick={lap}>lap</button>
        <button onClick={pause}>{startPauseTime > 0 ? 'unpause' : 'pause'}</button>
    </div>;
};

export default Stopwatch;
