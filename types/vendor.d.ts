declare module 'imagetracerjs' { const tracer: { imagedataToSVG(data: {width:number;height:number;data:Uint8ClampedArray}, options?:Record<string,unknown>):string }; export default tracer; }
declare module 'opentype.js' { export function parse(data:ArrayBuffer):any; const api:{parse:typeof parse}; export default api; }
