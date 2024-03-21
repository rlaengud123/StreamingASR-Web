// audio-processor.js
class PCMProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{ name: 'targetSampleRate', defaultValue: 16000 }];
    }

    constructor() {
        super();
        this.sampleQueue = [];
        this.targetSampleRate = 16000;
        this.samplesPerBlock = this.targetSampleRate / 10; // 100ms 길이의 데이터에 해당하는 샘플 수
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const targetSampleRate = parameters.targetSampleRate[0] || 16000;
        const ratio = sampleRate / targetSampleRate;

        if (input.length > 0) {
            const inputData = input[0];
            // 다운샘플링
            const downsampledData = inputData.filter((_, index) => index % ratio < 1);


            // 다운샘플링된 데이터를 샘플 큐에 추가
            // this.sampleQueue.push(...downsampledData);
            // 간단한 평균 필터 적용
            const filteredData = downsampledData.map((sample, index, array) => {
                const prevSample = array[index - 1] || sample; // 이전 샘플이 없으면 현재 샘플 사용
                const nextSample = array[index + 1] || sample; // 다음 샘플이 없으면 현재 샘플 사용
                return (prevSample + sample + nextSample) / 3;
            });

            // 필터링된 데이터를 샘플 큐에 추가
            this.sampleQueue.push(...filteredData);


            // 큐에 충분한 샘플이 쌓이면 100ms 블록 처리
            while (this.sampleQueue.length >= this.samplesPerBlock) {
                const block = this.sampleQueue.splice(0, this.samplesPerBlock);
                const int16Array = new Int16Array(block.length);
                block.forEach((sample, index) => {
                    int16Array[index] = Math.max(-32768, Math.min(32767, sample * 32768));
                });

                // 100ms 길이의 오디오 블록을 메인 스크립트로 전송
                this.port.postMessage(int16Array.buffer);
            }
        }
        return true;
    }
}

registerProcessor('pcm-processor', PCMProcessor);
