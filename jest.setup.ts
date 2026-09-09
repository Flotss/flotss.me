import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));
}
