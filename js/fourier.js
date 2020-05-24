function transform(signals){
    let transformedSignal = [];
    let N = signals.length;

    for(let k=0; k < N; k++){
        let re = 0;
        let im = 0;
        for(let n=0; n < N; n++){
            let theta = TWO_PI * (n / N) * k;
            re += signals[n] * cos(theta);
            im -= signals[n] * sin(theta);
        }

        re = re / N;
        im = im / N;

        transformedSignal[k]= {
            re,
            im,
            amp: sqrt((re * re) + (im * im)),
            freq: k,
            phase: atan2(im, re)
        };

    }

    return transformedSignal;

}