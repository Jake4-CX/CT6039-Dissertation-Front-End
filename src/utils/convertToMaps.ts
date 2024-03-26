// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function convertToMaps(obj: any): Map<number, Map<number, ResponseFragment[]>> {
  const outerMap = new Map<number, Map<number, ResponseFragment[]>>();
  Object.keys(obj).forEach(outerKey => {
    const innerMap = new Map<number, ResponseFragment[]>();
    Object.keys(obj[outerKey]).forEach(innerKey => {
      innerMap.set(Number(innerKey), obj[outerKey][innerKey]);
    });
    outerMap.set(Number(outerKey), innerMap);
  });
  return outerMap;
}