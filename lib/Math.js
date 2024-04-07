const { floor, random, round } = Math;


Math.randomInt = (from, to) => floor(random() * (to - from + 1) + from);

Math.round1 = n => round((n + .0001) * 10) / 10;

Math.round2 = n => round((n + .0001) * 100) / 100;

Math.round3 = n => round((n + .0001) * 1000) / 1000;
