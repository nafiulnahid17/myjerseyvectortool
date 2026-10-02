import tracer from 'imagetracerjs';
import {traceOptions,stripTrace} from '../lib/trace-options';
self.onmessage=(e:MessageEvent)=>{const {id,width,height,bytes,colors,detail}=e.data;try{const data={width,height,data:new Uint8ClampedArray(bytes)};const inner=stripTrace(tracer.imagedataToSVG(data,traceOptions(colors,detail)));self.postMessage({id,inner});}catch(err){self.postMessage({id,error:(err as Error).message});}};
